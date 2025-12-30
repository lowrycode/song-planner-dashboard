import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  stringDisplaySort,
  numericDisplaySort,
} from "../utils/table-data-helpers.ts";
import { renderCell } from "../utils/table-cell-renderers.tsx";

type TableSortSearchProps = {
  data: any[];
  headerMap: Record<string, string>;
  textHeaders?: string[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  title?: string;
};

export default function TableSortSearch({
  data,
  headerMap,
  textHeaders = [],
  searchKeys = [],
  searchPlaceholder = "Search...",
  title = "Song List",
}: TableSortSearchProps) {
  // Global search value
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Build columns dynamically
  const columns = React.useMemo<ColumnDef<any>[]>(() => {
    const textHeaderSet = new Set(textHeaders);

    return Object.entries(headerMap).map(([key, header]) => ({
      accessorKey: key,
      header,
      enableGlobalFilter: searchKeys.includes(key),
      filterFn: (row, columnId, filterValue) => {
        const raw = row.getValue(columnId);

        const value =
          typeof raw === "object" && raw !== null && "display" in raw
            ? String(raw.display ?? "")
            : String(raw ?? "");

        return value.toLowerCase().includes(String(filterValue).toLowerCase());
      },
      sortingFn: textHeaderSet.has(key)
        ? stringDisplaySort
        : numericDisplaySort,
    }));
  }, [headerMap, searchKeys, textHeaders]);

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
        {/* GLOBAL SEARCH INPUT */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-purple-900 text-purple-900 bg-white px-3 py-1"
        />
      </div>

      <div className="overflow-auto max-w-full h-[450px] mt-3">
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

                  const hasHover =
                    value &&
                    typeof value === "object" &&
                    value !== null &&
                    "hover" in value &&
                    typeof value.hover === "string" &&
                    Boolean(value.hover);

                  return (
                    <td
                      key={cell.id}
                      className={`border border-purple-900 px-3 py-1 ${
                        hasHover ? "cursor-help" : ""
                      }`}
                      title={
                        hasHover
                          ? (value as { hover?: string }).hover
                          : undefined
                      }
                    >
                      {renderCell(value)}
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
