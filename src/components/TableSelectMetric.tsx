import React from "react";
import type { SongMetric } from "../types/songs.ts";
import MetricSelector from "./MetricSelector";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, SortingFn } from "@tanstack/react-table";

type TableSelectMetricProps = {
  data: any[];
  headerMap: Record<string, string>;
  textHeaders?: string[];
  title?: string;
  metric: SongMetric;
  setMetric: React.Dispatch<React.SetStateAction<SongMetric>>;
};

// Alphabetical, case-insensitive sort
export const stringSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);

  return String(a ?? "").localeCompare(String(b ?? ""), undefined, {
    sensitivity: "base",
  });
};

// Numeric sort using `display` when present
export const numericDisplaySort: SortingFn<any> = (rowA, rowB, columnId) => {
  const getNumeric = (row: any) => {
    const v = row.getValue(columnId);
    return typeof v === "object" && v !== null && "display" in v
      ? Number(v.display)
      : Number(v);
  };

  return getNumeric(rowA) - getNumeric(rowB);
};

export default function TableSelectMetric({
  data,
  headerMap,
  textHeaders = [],
  title = "Song List",
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
      sortingFn: textHeaderSet.has(key) ? stringSort : numericDisplaySort,
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
                {row.getVisibleCells().map((cell) => {
                  const value = cell.getValue();

                  const hasHover =
                    value &&
                    typeof value === "object" &&
                    value !== null &&
                    "hover" in value &&
                    typeof value.hover === "string" &&
                    Boolean((value).hover);

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
                      {typeof value === "object" &&
                      value !== null &&
                      "display" in value
                        ? (value as { display?: React.ReactNode }).display
                        : (String(value) as React.ReactNode)}
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
