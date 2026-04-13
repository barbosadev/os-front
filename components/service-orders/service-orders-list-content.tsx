"use client";

import { ServiceOrdersTable } from "@/components/service-orders/service-orders-table";
import { Button } from "@/components/ui/button";
import type { ServiceOrder, ServiceOrderSortDirection, ServiceOrderSortField } from "@/types/service-order";

interface ServiceOrdersListContentProps {
  isLoading: boolean;
  error: string | null;
  visibleOrders: ServiceOrder[];
  totalItems: number;
  sortField: ServiceOrderSortField;
  sortDirection: ServiceOrderSortDirection;
  onSortFieldChange: (field: ServiceOrderSortField) => void;
  onSortDirectionChange: (direction: ServiceOrderSortDirection) => void;
  onRefresh: () => void;
  onResetFilters: () => void;
}

export function ServiceOrdersListContent({
  isLoading,
  error,
  visibleOrders,
  totalItems,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
  onRefresh,
  onResetFilters,
}: Readonly<ServiceOrdersListContentProps>) {
  if (isLoading) {
    return (
      <div className="px-5 py-16 text-center text-sm text-slate-600">
        Carregando ordens de serviço...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 px-5 py-10 text-sm text-rose-700">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">{error}</p>
        <Button variant="primary" onClick={onRefresh}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (visibleOrders.length === 0) {
    return (
      <div className="space-y-4 px-5 py-16 text-center">
        <p className="text-xl font-semibold tracking-tight text-slate-900">Nenhuma ordem encontrada.</p>
        <p className="text-sm text-slate-600">
          {totalItems === 0
            ? "Cadastre a primeira ordem de serviço para preencher esta visão."
            : "Ajuste os filtros ou a ordenação para localizar registros."}
        </p>
        {totalItems > 0 ? (
          <Button variant="primary" onClick={onResetFilters}>
            Limpar filtros
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <ServiceOrdersTable
      orders={visibleOrders}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortFieldChange={onSortFieldChange}
      onSortDirectionChange={onSortDirectionChange}
    />
  );
}