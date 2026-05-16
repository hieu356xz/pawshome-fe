"use client";

import React from "react";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "right" | "center";
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    showingLabel?: string;
    ofLabel?: string;
    previousLabel?: string;
    nextLabel?: string;
    itemsLabel?: string;
  };
  rowClassName?: (item: T) => string;
}

export function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found",
  pagination,
  rowClassName,
}: AdminTableProps<T>) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-6">
                      <div className="h-4 bg-gray-100 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-gray-50/50 transition-colors group",
                    rowClassName?.(item)
                  )}
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={cn(
                        "px-6 py-6",
                        column.className
                      )}
                    >
                      <div className={cn(
                        "flex items-center",
                        column.align === "right" && "justify-end",
                        column.align === "center" && "justify-center",
                        column.align === "left" && "justify-start"
                      )}>
                        {column.cell
                          ? column.cell(item)
                          : column.accessorKey
                          ? (item[column.accessorKey] as React.ReactNode)
                          : null}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-20 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                      <Users size={32} />
                    </div>
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {pagination.showingLabel || "Showing"}{" "}
            <span className="font-bold text-gray-900">{data.length}</span>{" "}
            {pagination.ofLabel || "of"}{" "}
            <span className="font-bold text-gray-900">
              {pagination.totalItems}
            </span>{" "}
            {pagination.itemsLabel || "items"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="rounded-xl border-gray-200 h-10 px-4"
            >
              {pagination.previousLabel || "Previous"}
            </Button>
            <Button
              variant="outline"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="rounded-xl border-gray-200 h-10 px-4"
            >
              {pagination.nextLabel || "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
