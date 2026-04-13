"use client";

import Link from "next/link";

import { ServiceOrdersFilters } from "@/components/service-orders/service-orders-filters";
import { ServiceOrdersListContent } from "@/components/service-orders/service-orders-list-content";
import { ServiceOrdersPagination } from "@/components/service-orders/service-orders-pagination";
import { useServiceOrdersView } from "@/hooks/use-service-orders-view";

export function ServiceOrdersDashboard() {
  const {
    visibleOrders,
    isLoading,
    error,
    clientFilter,
    statusFilter,
    sortField,
    sortDirection,
    currentPage,
    totalItems,
    totalPages,
    showingFrom,
    showingTo,
    refreshOrders,
    setClientFilter,
    setStatusFilter,
    setSortField,
    setSortDirection,
    setCurrentPage,
    resetFilters,
  } = useServiceOrdersView();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Painel de ordens de serviço</h1>
          <p className="mt-1 text-sm text-slate-600">
            Acompanhe suas ordens de serviço.
          </p>
        </div>

        <Link
          href="/cadastro"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold tracking-[0.01em] text-white transition hover:bg-slate-800"
        >
          Nova ordem
        </Link>
      </header>

      <section>
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
          <ServiceOrdersFilters
            clientFilter={clientFilter}
            statusFilter={statusFilter}
            onClientFilterChange={setClientFilter}
            onStatusFilterChange={setStatusFilter}
            onResetFilters={resetFilters}
          />

          <ServiceOrdersListContent
            isLoading={isLoading}
            error={error}
            visibleOrders={visibleOrders}
            totalItems={totalItems}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
            onRefresh={() => void refreshOrders()}
            onResetFilters={resetFilters}
          />

          <ServiceOrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
}
