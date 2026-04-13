import { NextResponse } from "next/server";
import { z } from "zod";

import { serviceOrderFormSchema } from "@/lib/service-order-form-schema";
import { createServiceOrderRecord, serviceOrdersSeed } from "@/services/service-orders-store";

let serviceOrders = [...serviceOrdersSeed];

function getApiOrdersUrl(): string | null {
  const baseUrl = process.env.ORDERS_API_BASE_URL?.trim();
  if (!baseUrl) {
    return null;
  }

  return `${baseUrl.replace(/\/$/, "")}/orders`;
}

async function parseRemoteError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? "Falha ao comunicar com a API de ordens de serviço.";
}

export async function GET() {
  const apiOrdersUrl = getApiOrdersUrl();
  if (apiOrdersUrl) {
    const remoteResponse = await fetch(apiOrdersUrl, {
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
    const remoteResponse = await fetch(apiOrdersUrl, {
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
