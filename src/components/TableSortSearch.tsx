import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

type TableSortSearchProps = {
  data: any[];
  headerMap: Record<string, string>;
  searchKeys?: string[];
  searchPlaceholder?: string;
  title?: string;
};

export default function TableSortSearch({
  data,
  headerMap,
  searchKeys = [],
  searchPlaceholder = "Search...",
  title = "Song List",
}: TableSortSearchProps) {
  // Global search value
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Build columns dynamically
  const columns = React.useMemo<ColumnDef<any>[]>(
    () =>
      Object.entries(headerMap).map(([key, header]) => ({
        accessorKey: key,
        header,
        enableGlobalFilter: searchKeys.includes(key),
        filterFn: (row, columnId, filterValue) => {
          const value = String(row.getValue(columnId) ?? "").toLowerCase();
          return value.includes(String(filterValue).toLowerCase());
        },
      })),
    [headerMap, searchKeys]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter, // register global filter
    },
    onGlobalFilterChange: setGlobalFilter, // handler
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <>
      <div className="flex flex-wrap gap-x-10 gap-y-2 justify-between items-center align-middle">
        <h2 className="text-xl font-extrabold text-purple-900">
          {title}
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({filteredCount} rows)
          </span>
        </h2>
        <div className="italic my-3 text-purple-900">
          Click on column headers to sort
        </div>
        {/* GLOBAL SEARCH INPUT */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-purple-900 text-purple-900 bg-white px-3 py-1"
        />
      </div>

      <div className="overflow-y-auto h-[450px] mt-3">
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
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-purple-900 px-3 py-1"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
