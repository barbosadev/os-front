import type {
  ServiceOrder,
  ServiceOrderSortDirection,
  ServiceOrderSortField,
  ServiceOrderStatus,
} from "@/types/service-order";

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateBR(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function getStatusTone(status: ServiceOrderStatus): string {
  switch (status) {
    case "open":
      return "bg-sky-100 text-sky-800 ring-sky-200";
    case "in_progress":
      return "bg-amber-100 text-amber-800 ring-amber-200";
    case "completed":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "canceled":
      return "bg-rose-100 text-rose-800 ring-rose-200";
  }
}

export function sortServiceOrders(
  orders: ServiceOrder[],
  sortField: ServiceOrderSortField,
  sortDirection: ServiceOrderSortDirection,
): ServiceOrder[] {
  const sorted = [...orders].sort((left, right) => {
    if (sortField === "estimatedValue") {
      return left.estimatedValue - right.estimatedValue;
    }

    return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  });

  return sortDirection === "asc" ? sorted : sorted.reverse();
}
