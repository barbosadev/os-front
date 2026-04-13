import type { ServiceOrder } from "@/types/service-order";

import type { ServiceOrderFormValues } from "@/lib/service-order-form-schema";

const serviceOrdersUrl = "/api/service-orders";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Falha ao comunicar com a API de ordens de serviço.");
  }

  return (await response.json()) as T;
}

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const response = await fetch(serviceOrdersUrl, {
    cache: "no-store",
  });

  return parseResponse<ServiceOrder[]>(response);
}

export async function createServiceOrder(
  input: ServiceOrderFormValues,
): Promise<ServiceOrder> {
  const response = await fetch(serviceOrdersUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<ServiceOrder>(response);
}
