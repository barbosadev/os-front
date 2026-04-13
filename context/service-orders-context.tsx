"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { createServiceOrder, fetchServiceOrders } from "@/services/service-orders-api";
import type {
  ServiceOrder,
  ServiceOrderSortDirection,
  ServiceOrderSortField,
  ServiceOrderStatus,
} from "@/types/service-order";

import type { ServiceOrderFormValues } from "@/lib/service-order-form-schema";

type ServiceOrdersFilterStatus = ServiceOrderStatus | "all";

interface ServiceOrdersContextValue {
  orders: ServiceOrder[];
  isLoading: boolean;
  error: string | null;
  clientFilter: string;
  statusFilter: ServiceOrdersFilterStatus;
  sortField: ServiceOrderSortField;
  sortDirection: ServiceOrderSortDirection;
  pageSize: number;
  currentPage: number;
  refreshOrders: () => Promise<void>;
  createOrder: (input: ServiceOrderFormValues) => Promise<ServiceOrder>;
  setClientFilter: (value: string) => void;
  setStatusFilter: (value: ServiceOrdersFilterStatus) => void;
  setSortField: (value: ServiceOrderSortField) => void;
  setSortDirection: (value: ServiceOrderSortDirection) => void;
  setCurrentPage: (value: number) => void;
  resetFilters: () => void;
}

const ServiceOrdersContext = createContext<ServiceOrdersContextValue | null>(null);

function useServiceOrdersState(): ServiceOrdersContextValue {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilterState] = useState("");
  const [statusFilter, setStatusFilterState] = useState<ServiceOrdersFilterStatus>("all");
  const [sortField, setSortFieldState] = useState<ServiceOrderSortField>("createdAt");
  const [sortDirection, setSortDirectionState] = useState<ServiceOrderSortDirection>("desc");
  const [currentPage, setCurrentPageState] = useState(1);

  const pageSize = 5;

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const serviceOrders = await fetchServiceOrders();
      setOrders(serviceOrders);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar as ordens.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const createOrder = useCallback(
    async (input: ServiceOrderFormValues) => {
      const newOrder = await createServiceOrder(input);
      setOrders((currentOrders) => [newOrder, ...currentOrders]);
      setCurrentPageState(1);
      return newOrder;
    },
    [],
  );

  const setClientFilter = useCallback((value: string) => {
    setClientFilterState(value);
    setCurrentPageState(1);
  }, []);

  const setStatusFilter = useCallback((value: ServiceOrdersFilterStatus) => {
    setStatusFilterState(value);
    setCurrentPageState(1);
  }, []);

  const setSortField = useCallback((value: ServiceOrderSortField) => {
    setSortFieldState(value);
    setCurrentPageState(1);
  }, []);

  const setSortDirection = useCallback((value: ServiceOrderSortDirection) => {
    setSortDirectionState(value);
    setCurrentPageState(1);
  }, []);

  const setCurrentPage = useCallback((value: number) => {
    setCurrentPageState(value);
  }, []);

  const resetFilters = useCallback(() => {
    setClientFilterState("");
    setStatusFilterState("all");
    setSortFieldState("createdAt");
    setSortDirectionState("desc");
    setCurrentPageState(1);
  }, []);

  return {
    orders,
    isLoading,
    error,
    clientFilter,
    statusFilter,
    sortField,
    sortDirection,
    pageSize,
    currentPage,
    refreshOrders,
    createOrder,
    setClientFilter,
    setStatusFilter,
    setSortField,
    setSortDirection,
    setCurrentPage,
    resetFilters,
  };
}

export function ServiceOrdersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const value = useServiceOrdersState();

  return <ServiceOrdersContext.Provider value={value}>{children}</ServiceOrdersContext.Provider>;
}

export function useServiceOrdersContext() {
  const context = useContext(ServiceOrdersContext);

  if (context === null) {
    throw new Error("useServiceOrdersContext deve ser usado dentro de ServiceOrdersProvider.");
  }

  return context;
}
