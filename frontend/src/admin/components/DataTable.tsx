import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records available to display.',
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-[#141414] border border-neutral-800 rounded overflow-hidden shadow-xl flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-[#181818]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/80 text-xs">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 px-4 text-center text-neutral-500 uppercase tracking-widest text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="hover:bg-neutral-800/30 transition-colors group"
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-3.5 px-4 text-neutral-300 align-middle ${
                        col.className || ''
                      }`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String(row[col.accessor] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="py-3 px-4 border-t border-neutral-800 bg-[#161616] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div>
            Showing Page <span className="text-white font-medium">{pagination.currentPage}</span> of{' '}
            <span className="text-white font-medium">{pagination.totalPages}</span> ({pagination.totalItems} total records)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-medium text-xs">
              {pagination.currentPage}
            </span>

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

