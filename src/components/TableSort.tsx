import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

type TableSortProps = {
  data: any[];
  headerMap: Record<string, string>;
  title: string;
};

export default function TableSort({ data, headerMap, title }: TableSortProps) {
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Build table columns dynamically
  const columns = React.useMemo<ColumnDef<any>[]>(() => {
    return Object.entries(headerMap).map(([key, header]) => ({
      id: key,
      header,
      accessorKey: key,
    }));
  }, [headerMap]);

  // React Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Table row count
  const rowCount = table.getRowModel().rows.length;

  return (
    <>
      {/* Header and metric selector */}
      <h2 className="text-xl font-extrabold text-purple-900">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-600 whitespace-nowrap">
          ({rowCount} rows)
        </span>
      </h2>
      {/* Table */}
      <div className="w-full mt-3 overflow-y-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="sticky z-10 top-0 border border-purple-900 bg-purple-900 text-purple-50 px-3 py-1 text-left cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-violet-100">
                {row.getVisibleCells().map((cell) => {
                  const value = cell.getValue();
                  return (
                    <td
                      key={cell.id}
                      className={"border border-purple-900 px-3 py-1"}
                    >
                      {value as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
