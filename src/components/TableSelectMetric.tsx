import React from "react";
import type { SongMetric } from "../types/songs.ts";
import MetricSelector from "./MetricSelector";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  stringDisplaySort,
  numericDisplaySort,
} from "../utils/table-data-helpers.ts";
import { renderCell } from "../utils/table-cell-renderers.tsx";

type TableSelectMetricProps = {
  data: any[];
  headerMap: Record<string, string>;
  textHeaders?: string[];
  title?: string;
  maxHeight?: number | string;
  metric: SongMetric;
  setMetric: React.Dispatch<React.SetStateAction<SongMetric>>;
};

export default function TableSelectMetric({
  data,
  headerMap,
  textHeaders = [],
  title = "Song List",
  maxHeight = "450px",
  metric,
  setMetric,
}: TableSelectMetricProps) {
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Build table columns dynamically
  const columns = React.useMemo<ColumnDef<any>[]>(() => {
    const textHeaderSet = new Set(textHeaders);

    return Object.entries(headerMap).map(([key, header]) => ({
      id: key,
      header,
      accessorFn: (row) => row[key],
      sortingFn: textHeaderSet.has(key)
        ? stringDisplaySort
        : numericDisplaySort,
    }));
  }, [headerMap, textHeaders]);

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
      <div className="flex flex-wrap gap-x-10 gap-y-2 justify-between items-center align-middle">
        <h2 className="text-xl font-extrabold text-purple-900">
          {title}
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({rowCount} rows)
          </span>
        </h2>
        <MetricSelector metric={metric} setMetric={setMetric} />
      </div>
      {/* Table */}
      <div
        className="overflow-y-auto mt-3"
        style={{
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        }}
      >
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
                      header.getContext(),
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
