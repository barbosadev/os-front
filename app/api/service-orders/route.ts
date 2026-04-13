import { NextResponse } from "next/server";
import { z } from "zod";

import { getMockConfig, createInitialMockOrders } from "@/app/api/service-orders/config/mock-config";
import { getRemoteApiConfig, type RemoteApiConfig } from "@/app/api/service-orders/config/remote-api-config";
import { serviceOrderFormSchema } from "@/lib/service-order-form-schema";
import { createServiceOrderRecord } from "@/services/service-orders-store";
import type { ServiceOrder, ServiceOrderStatus } from "@/types/service-order";

let serviceOrders = createInitialMockOrders();
let cachedAccessToken: string | null = null;

type RemoteStatusName = "Aberta" | "Em andamento" | "Concluída" | "Cancelada";

interface RemoteOrder {
  id: number;
  cliente: string;
  descricao: string;
  valor_estimado: number | string;
  status: {
    nome: RemoteStatusName;
  };
  data_criacao: string;
}

interface RemoteCreateOrderPayload {
  cliente: string;
  descricao: string;
  valor_estimado: number;
}

interface RemoteUpdateStatusPayload {
  status: RemoteStatusName;
}

async function parseRemoteError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  if (Array.isArray(payload?.message)) {
    return payload.message.join(" | ");
  }

  if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
    return payload.message;
  }

  return "Falha ao comunicar com a API de ordens de serviço.";
}

function mapRemoteStatusToFront(status: RemoteStatusName): ServiceOrderStatus {
  switch (status) {
    case "Aberta":
      return "open";
    case "Em andamento":
      return "in_progress";
    case "Concluída":
      return "completed";
    case "Cancelada":
      return "canceled";
  }
}

function mapFrontStatusToRemote(status: ServiceOrderStatus): RemoteStatusName {
  switch (status) {
    case "open":
      return "Aberta";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluída";
    case "canceled":
      return "Cancelada";
  }
}

function toRemoteCreatePayload(input: z.infer<typeof serviceOrderFormSchema>): RemoteCreateOrderPayload {
  return {
    cliente: input.client,
    descricao: input.description,
    valor_estimado: input.estimatedValue,
  };
}

function toServiceOrder(remote: RemoteOrder): ServiceOrder {
  const createdAt = remote.data_criacao;
  const createdYear = new Date(createdAt).getFullYear();

  return {
    id: remote.id,
    orderNumber: `OS-${Number.isNaN(createdYear) ? new Date().getFullYear() : createdYear}-${String(remote.id).padStart(3, "0")}`,
    client: remote.cliente,
    description: remote.descricao,
    estimatedValue: Number(remote.valor_estimado),
    status: mapRemoteStatusToFront(remote.status.nome),
    createdAt,
  };
}

async function loginOnRemoteApi(remoteConfig: RemoteApiConfig): Promise<string> {
  const { baseUrl, username, password } = remoteConfig;

  const authResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!authResponse.ok) {
    const message = await parseRemoteError(authResponse);
    throw new Error(message);
  }

  const payload = (await authResponse.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Resposta de login inválida da API remota.");
  }

  cachedAccessToken = payload.access_token;
  return payload.access_token;
}

async function getRemoteToken(remoteConfig: RemoteApiConfig, forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedAccessToken) {
    return cachedAccessToken;
  }

  return loginOnRemoteApi(remoteConfig);
}

async function fetchWithAutoLogin(
  remoteConfig: RemoteApiConfig,
  url: string,
  init: RequestInit,
): Promise<Response> {
  const firstToken = await getRemoteToken(remoteConfig);
  const firstResponse = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${firstToken}`,
    },
  });

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  const refreshedToken = await getRemoteToken(remoteConfig, true);
  return fetch(url, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${refreshedToken}`,
    },
  });
}

export async function GET() {
  const remoteConfig = getRemoteApiConfig();
  const mockConfig = getMockConfig();

  if (remoteConfig && !mockConfig.enabled) {
    const remoteResponse = await fetchWithAutoLogin(remoteConfig, remoteConfig.ordersUrl, {
      cache: "no-store",
    });

    if (!remoteResponse.ok) {
      const message = await parseRemoteError(remoteResponse);
      return NextResponse.json({ message }, { status: remoteResponse.status });
    }

    const remoteOrders = (await remoteResponse.json()) as RemoteOrder[];
    return NextResponse.json(remoteOrders.map(toServiceOrder));
  }

  return NextResponse.json(serviceOrders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = serviceOrderFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Dados inválidos para criação da ordem de serviço.",
        issues: z.flattenError(result.error),
      },
      { status: 400 },
    );
  }

  const remoteConfig = getRemoteApiConfig();
  const mockConfig = getMockConfig();

  if (remoteConfig && !mockConfig.enabled) {
    const createPayload = toRemoteCreatePayload(result.data);

    const remoteResponse = await fetchWithAutoLogin(remoteConfig, remoteConfig.ordersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
    });

    if (!remoteResponse.ok) {
      const message = await parseRemoteError(remoteResponse);
      return NextResponse.json({ message }, { status: remoteResponse.status });
    }

    let remoteOrder = (await remoteResponse.json()) as RemoteOrder;

    if (result.data.status !== "open") {
      const statusPayload: RemoteUpdateStatusPayload = {
        status: mapFrontStatusToRemote(result.data.status),
      };

      const statusResponse = await fetchWithAutoLogin(remoteConfig, `${remoteConfig.ordersUrl}/${remoteOrder.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusPayload),
      });

      if (!statusResponse.ok) {
        const message = await parseRemoteError(statusResponse);
        return NextResponse.json({ message }, { status: statusResponse.status });
      }

      remoteOrder = (await statusResponse.json()) as RemoteOrder;
    }

    return NextResponse.json(toServiceOrder(remoteOrder), { status: 201 });
  }

  const newOrder = createServiceOrderRecord(result.data, serviceOrders);
  serviceOrders = [newOrder, ...serviceOrders];

  return NextResponse.json(newOrder, { status: 201 });
}
