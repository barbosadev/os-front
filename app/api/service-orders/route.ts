import { NextResponse } from "next/server";
import { z } from "zod";

import { serviceOrderFormSchema } from "@/lib/service-order-form-schema";
import { createServiceOrderRecord, serviceOrdersSeed } from "@/services/service-orders-store";

let serviceOrders = [...serviceOrdersSeed];

export async function GET() {
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

  const newOrder = createServiceOrderRecord(result.data, serviceOrders);
  serviceOrders = [newOrder, ...serviceOrders];

  return NextResponse.json(newOrder, { status: 201 });
}
