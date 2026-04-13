import { serviceOrdersSeed } from "@/services/service-orders-store";

export interface MockConfig {
  enabled: boolean;
}

export function getMockConfig(): MockConfig {
  return {
    enabled: !process.env.ORDERS_API_BASE_URL?.trim(),
  };
}

export function createInitialMockOrders() {
  return [...serviceOrdersSeed];
}
