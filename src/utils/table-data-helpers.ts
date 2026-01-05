import type { SortingFn } from "@tanstack/react-table";

// Alphabetical, case-insensitive sort using `display` when present
export const stringDisplaySort: SortingFn<any> = (rowA, rowB, columnId) => {
  const getString = (row: any) => {
    const v = row.getValue(columnId);
    if (typeof v === "object" && v !== null && "display" in v) {
      return String(v.display ?? "");
    }
    return String(v ?? "");
  };

  return getString(rowA).localeCompare(getString(rowB), undefined, {
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

// Global filter using `display` when present
export const displayStringGlobalFilter = (
  row: any,
  columnIds: string[],
  filterValue: unknown
) => {
  const search = String(filterValue).toLowerCase();
  if (!search) return true;

  return columnIds.some((columnId) => {
    const raw = row.getValue(columnId);
    const value =
      typeof raw === "object" && raw !== null && "display" in raw
        ? String(raw.display ?? "")
        : String(raw ?? "");

    return value.toLowerCase().includes(search);
  });
};
