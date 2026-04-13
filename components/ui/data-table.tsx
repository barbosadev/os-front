"use client";

import type { Key, ReactNode } from "react";
import clsx from "clsx";

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableColumn<TItem, TSortField extends string = string> {
  id: string;
  header: ReactNode;
  render: (item: TItem) => ReactNode;
  sortableField?: TSortField;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<TItem, TSortField extends string = string> {
  items: readonly TItem[];
  columns: readonly DataTableColumn<TItem, TSortField>[];
  getRowKey: (item: TItem) => Key;
  sortField?: TSortField;
  sortDirection?: DataTableSortDirection;
  onSortChange?: (field: TSortField, direction: DataTableSortDirection) => void;
  className?: string;
  tableClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((item: TItem) => string);
}

function SortIndicator({ isActive, direction }: Readonly<{ isActive: boolean; direction: DataTableSortDirection }>) {
  if (!isActive) return null;

  return <span className="ml-1 text-xs">{direction === "desc" ? "▼" : "▲"}</span>;
}

function SortableHeaderButton<TSortField extends string>({
  label,
  field,
  currentSortField,
  sortDirection,
  onSort,
}: Readonly<{
  label: ReactNode;
  field: TSortField;
  currentSortField?: TSortField;
  sortDirection?: DataTableSortDirection;
  onSort: (field: TSortField, direction: DataTableSortDirection) => void;
}>) {
  const isActive = currentSortField === field;
  const nextDirection = isActive && sortDirection === "desc" ? "asc" : "desc";

  return (
    <button
      type="button"
      onClick={() => onSort(field, nextDirection)}
      className="inline-flex items-center cursor-pointer transition-colors hover:text-slate-900"
    >
      {label}
      <SortIndicator isActive={isActive} direction={nextDirection} />
    </button>
  );
}

export function DataTable<TItem, TSortField extends string = string>({
  items,
  columns,
  getRowKey,
  sortField,
  sortDirection,
  onSortChange,
  className,
  tableClassName,
  headerRowClassName,
  bodyClassName,
  rowClassName,
}: Readonly<DataTableProps<TItem, TSortField>>) {
  return (
    <div className={clsx("overflow-hidden border-y border-slate-200", className)}>
      <div className="overflow-x-auto">
        <table className={clsx("min-w-full divide-y divide-slate-200 text-left text-sm", tableClassName)}>
          <thead className={clsx("bg-slate-50 text-xs uppercase tracking-wide text-slate-600", headerRowClassName)}>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={clsx("px-5 py-4 font-semibold", column.headerClassName)}>
                  {column.sortableField && onSortChange ? (
                    <SortableHeaderButton
                      label={column.header}
                      field={column.sortableField}
                      currentSortField={sortField}
                      sortDirection={sortDirection}
                      onSort={onSortChange}
                    />
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={clsx("divide-y divide-slate-200 bg-white", bodyClassName)}>
            {items.map((item) => (
              <tr
                key={getRowKey(item)}
                className={clsx(
                  "align-top transition hover:bg-slate-50/70",
                  typeof rowClassName === "function" ? rowClassName(item) : rowClassName,
                )}
              >
                {columns.map((column) => (
                  <td key={column.id} className={clsx("px-5 py-4", column.cellClassName)}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}