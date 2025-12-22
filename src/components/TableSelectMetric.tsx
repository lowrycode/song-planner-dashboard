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

type TableSelectMetricProps = {
  data: any[];
  headerMap: Record<string, string>;
  title?: string;
  metric: SongMetric;
  setMetric: React.Dispatch<React.SetStateAction<SongMetric>>;
};

export default function TableSelectMetric({
  data,
  headerMap,
  title = "Song List",
  metric,
  setMetric,
}: TableSelectMetricProps) {
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Build table columns dynamically
  const columns = React.useMemo<ColumnDef<any>[]>(
    () =>
      Object.entries(headerMap).map(([key, header]) => ({
        id: key,
        header,
        accessorFn: (row) => {
          const value = row[key];
          if (
            typeof value === "object" &&
            value !== null &&
            "display" in value
          ) {
            return value.display;
          }
          return value;
        },
        sortingFn: "basic",
      })),
    [headerMap]
  );

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
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-purple-900 px-3 py-1"
                    title={(() => {
                      const value = cell.getValue();
                      if (
                        typeof value === "object" &&
                        value !== null &&
                        "raw" in value
                      ) {
                        return (value as { raw?: string }).raw;
                      }
                      return undefined;
                    })()}
                  >
                    {(() => {
                      const value = cell.getValue();
                      if (
                        typeof value === "object" &&
                        value !== null &&
                        "display" in value
                      ) {
                        return (value as { display?: React.ReactNode }).display;
                      }
                      return value as React.ReactNode;
                    })()}
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
