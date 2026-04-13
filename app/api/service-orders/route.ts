import { NextResponse } from "next/server";
import { z } from "zod";

import { serviceOrderFormSchema } from "@/lib/service-order-form-schema";
import { createServiceOrderRecord, serviceOrdersSeed } from "@/services/service-orders-store";

let serviceOrders = [...serviceOrdersSeed];
let cachedAccessToken: string | null = null;

function getApiBaseUrl(): string | null {
  const baseUrl = process.env.ORDERS_API_BASE_URL?.trim();
  return baseUrl ? baseUrl.replace(/\/$/, "") : null;
}

function getApiOrdersUrl(): string | null {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/orders` : null;
}

async function parseRemoteError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? "Falha ao comunicar com a API de ordens de serviço.";
}

async function loginOnRemoteApi(baseUrl: string): Promise<string> {
  const username = process.env.ORDERS_API_USERNAME?.trim() || "admin";
  const password = process.env.ORDERS_API_PASSWORD?.trim() || "admin123";

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

async function getRemoteToken(baseUrl: string, forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedAccessToken) {
    return cachedAccessToken;
  }

  return loginOnRemoteApi(baseUrl);
}

async function fetchWithAutoLogin(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("URL base da API não configurada.");
  }

  const firstToken = await getRemoteToken(baseUrl);
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

  const refreshedToken = await getRemoteToken(baseUrl, true);
  return fetch(url, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${refreshedToken}`,
    },
  });
}

export async function GET() {
  const apiOrdersUrl = getApiOrdersUrl();
  if (apiOrdersUrl) {
    const remoteResponse = await fetchWithAutoLogin(apiOrdersUrl, {
      cache: "no-store",
    });

    if (!remoteResponse.ok) {
      const message = await parseRemoteError(remoteResponse);
      return NextResponse.json({ message }, { status: remoteResponse.status });
    }

    const remoteOrders = await remoteResponse.json();
    return NextResponse.json(remoteOrders);
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

  const apiOrdersUrl = getApiOrdersUrl();
  if (apiOrdersUrl) {
    const remoteResponse = await fetchWithAutoLogin(apiOrdersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });

    if (!remoteResponse.ok) {
      const message = await parseRemoteError(remoteResponse);
      return NextResponse.json({ message }, { status: remoteResponse.status });
    }

    const remoteOrder = await remoteResponse.json();
    return NextResponse.json(remoteOrder, { status: 201 });
  }

  const newOrder = createServiceOrderRecord(result.data, serviceOrders);
  serviceOrders = [newOrder, ...serviceOrders];

  return NextResponse.json(newOrder, { status: 201 });
}
