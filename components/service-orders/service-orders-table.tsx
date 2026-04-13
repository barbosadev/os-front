"use client";

import clsx from "clsx";

import { DataTable, type DataTableColumn } from "../ui/data-table";
import { formatCurrencyBRL, formatDateBR, getStatusTone } from "@/lib/service-order-utils";
import { serviceOrderStatusLabels, type ServiceOrder, type ServiceOrderSortDirection, type ServiceOrderSortField } from "@/types/service-order";

interface ServiceOrdersTableProps {
  orders: ServiceOrder[];
  sortField: ServiceOrderSortField;
  sortDirection: ServiceOrderSortDirection;
  onSortFieldChange: (field: ServiceOrderSortField) => void;
  onSortDirectionChange: (direction: ServiceOrderSortDirection) => void;
}

const serviceOrdersTableColumns = [
  {
    id: "orderNumber",
    header: "Número",
    render: (order: ServiceOrder) => <span className="font-medium text-slate-900">{order.orderNumber}</span>,
  },
  {
    id: "client",
    header: "Cliente",
    render: (order: ServiceOrder) => <span className="text-slate-700">{order.client}</span>,
  },
  {
    id: "description",
    header: "Descrição",
    cellClassName: "max-w-[320px] text-slate-600",
    render: (order: ServiceOrder) => order.description,
  },
  {
    id: "status",
    header: "Status",
    cellClassName: "text-center",
    render: (order: ServiceOrder) => (
      <span
        className={clsx(
          "inline-flex w-full justify-center rounded-full px-3 py-1 text-nowrap text-xs font-semibold ring-1 ring-inset",
          getStatusTone(order.status),
        )}
      >
        {serviceOrderStatusLabels[order.status]}
      </span>
    ),
  },
  {
    id: "createdAt",
    header: "Data de criação",
    sortableField: "createdAt" as const,
    render: (order: ServiceOrder) => <span className="text-slate-600">{formatDateBR(order.createdAt)}</span>,
  },
  {
    id: "estimatedValue",
    header: "Valor estimado",
    sortableField: "estimatedValue" as const,
    render: (order: ServiceOrder) => (
      <span className="font-medium text-slate-900">{formatCurrencyBRL(order.estimatedValue)}</span>
    ),
  },
] satisfies readonly DataTableColumn<ServiceOrder, ServiceOrderSortField>[];

export function ServiceOrdersTable({
  orders,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: Readonly<ServiceOrdersTableProps>) {
  function handleSort(field: ServiceOrderSortField, direction: ServiceOrderSortDirection) {
    onSortFieldChange(field);
    onSortDirectionChange(direction);
  }

  return (
    <DataTable
      items={orders}
      columns={serviceOrdersTableColumns}
      getRowKey={(order: ServiceOrder) => order.id}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSort}
    />
  );
}
