"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  serviceOrderStatusOptions,
  type ServiceOrderStatus,
} from "@/types/service-order";

interface ServiceOrdersFiltersProps {
  clientFilter: string;
  statusFilter: ServiceOrderStatus | "all";
  onClientFilterChange: (value: string) => void;
  onStatusFilterChange: (value: ServiceOrderStatus | "all") => void;
  onResetFilters: () => void;
}

export function ServiceOrdersFilters({
  clientFilter,
  statusFilter,
  onClientFilterChange,
  onStatusFilterChange,
  onResetFilters,
}: Readonly<ServiceOrdersFiltersProps>) {
  return (
    <section className="p-5">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Ordens de serviço</h2>

      <div className="mt-4 grid gap-2 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Cliente</span>
          <Input
            value={clientFilter}
            onChange={(event) => onClientFilterChange(event.target.value)}
            placeholder="Buscar por nome do cliente"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">Status</span>
          <Select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as ServiceOrderStatus | "all")}
          >
            <option value="all">Todos os status</option>
            {serviceOrderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>
    </section>
  );
}
