export const serviceOrderStatusLabels = {
  open: "Aberta",
  in_progress: "Em andamento",
  completed: "Concluída",
  canceled: "Cancelada",
} as const;

export type ServiceOrderStatus = keyof typeof serviceOrderStatusLabels;

export const serviceOrderStatusOptions = [
  { value: "open", label: serviceOrderStatusLabels.open },
  { value: "in_progress", label: serviceOrderStatusLabels.in_progress },
  { value: "completed", label: serviceOrderStatusLabels.completed },
  { value: "canceled", label: serviceOrderStatusLabels.canceled },
] as const;

export const serviceOrderSortFieldLabels = {
  createdAt: "Data de criação",
  estimatedValue: "Valor estimado",
} as const;

export type ServiceOrderSortField = keyof typeof serviceOrderSortFieldLabels;

export const serviceOrderSortDirectionLabels = {
  desc: "Decrescente",
  asc: "Crescente",
} as const;

export type ServiceOrderSortDirection = keyof typeof serviceOrderSortDirectionLabels;

export interface ServiceOrder {
  id: number;
  orderNumber: string;
  client: string;
  description: string;
  estimatedValue: number;
  status: ServiceOrderStatus;
  createdAt: string;
}

export interface CreateServiceOrderInput {
  client: string;
  description: string;
  estimatedValue: number;
  status: ServiceOrderStatus;
}
