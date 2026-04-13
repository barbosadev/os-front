"use client";

import { Button } from "@/components/ui/button";

interface ServiceOrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  showingFrom: number;
  showingTo: number;
  onPageChange: (page: number) => void;
}

export function ServiceOrdersPagination({
  currentPage,
  totalPages,
  totalItems,
  showingFrom,
  showingTo,
  onPageChange,
}: Readonly<ServiceOrdersPaginationProps>) {
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Exibindo {showingFrom} a {showingTo} de {totalItems} ordens
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
