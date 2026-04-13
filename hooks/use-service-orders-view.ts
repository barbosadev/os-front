"use client";

import { useMemo } from "react";

import { useServiceOrdersContext } from "@/context/service-orders-context";
import { normalizeText, sortServiceOrders } from "@/lib/service-order-utils";

export function useServiceOrdersView() {
  const {
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
  } = useServiceOrdersContext();

  const summary = useMemo(() => {
    const initialSummary = {
      totalOrders: orders.length,
      openOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0,
      canceledOrders: 0,
      totalEstimatedValue: 0,
    };

    return orders.reduce((accumulator, order) => {
      accumulator.totalEstimatedValue += order.estimatedValue;

      switch (order.status) {
        case "open":
          accumulator.openOrders += 1;
          break;
        case "in_progress":
          accumulator.inProgressOrders += 1;
          break;
        case "completed":
          accumulator.completedOrders += 1;
          break;
        case "canceled":
          accumulator.canceledOrders += 1;
          break;
      }

      return accumulator;
    }, initialSummary);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedClientFilter = normalizeText(clientFilter);

    return orders.filter((order) => {
      const matchesClient =
        normalizedClientFilter.length === 0 ||
        normalizeText(order.client).includes(normalizedClientFilter);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesClient && matchesStatus;
    });
  }, [clientFilter, orders, statusFilter]);

  const sortedOrders = useMemo(
    () => sortServiceOrders(filteredOrders, sortField, sortDirection),
    [filteredOrders, sortDirection, sortField],
  );

  const totalItems = sortedOrders.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const visibleOrders = sortedOrders.slice(startIndex, startIndex + pageSize);
  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, totalItems);
  const activeFilters = clientFilter.length > 0 || statusFilter !== "all";

  return {
    orders,
    visibleOrders,
    summary,
    isLoading,
    error,
    clientFilter,
    statusFilter,
    sortField,
    sortDirection,
    pageSize,
    currentPage: safeCurrentPage,
    totalItems,
    totalPages,
    showingFrom,
    showingTo,
    activeFilters,
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
