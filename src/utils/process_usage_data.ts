import type { HeaderFilter, Activity } from "../types/dashboard.ts";
import type { SongUsage } from "../types/songs.ts";

export function generateMonthRange(start: Date, end: Date): string[] {
  const months: string[] = [];
  const date = new Date(start);

  while (date <= end) {
    months.push(
      date.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    );
    date.setMonth(date.getMonth() + 1);
  }

  return months;
}

function formatMonth(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function prepareUsageData(
  usages: SongUsage[],
  activities: Activity[],
  headerFilters: HeaderFilter
) {
  // Get month range for chart x-axis
  const from_date_str: string | undefined = headerFilters.from_date;
  const to_date_str: string | undefined = headerFilters.to_date;

  const from_date: Date = from_date_str
    ? new Date(from_date_str)
    : new Date("1990-01-01");
  const to_date: Date = to_date_str ? new Date(to_date_str) : new Date();

  const allMonths = generateMonthRange(from_date, to_date);

  // monthActivityMap in format [month][activity] = count
  const monthActivityMap: Record<string, Record<number, number>> = {};

  // Initialise monthActivityMap for each church activity (to zero)
  allMonths.forEach((month) => {
    monthActivityMap[month] = {};
    activities.forEach((activity) => {
      monthActivityMap[month][activity.id] = 0;
    });
  });

  // populate counts
  usages.forEach(({ used_date, church_activity_id }) => {
    const month = formatMonth(used_date);
    if (monthActivityMap[month]) {
      monthActivityMap[month][church_activity_id]++;
    }
  });

  const colors = [
    "#1f77b4", // strong blue
    "#ff7f0e", // vivid orange
    "#2ca02c", // bright green
    "#d62728", // strong red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#bcbd22", // olive green
    "#17becf", // cyan
    "#393b79", // dark navy
    "#ff9896", // light coral
    "#7f7f7f", // gray
  ];

  const datasets = activities.map((activity, index) => ({
    label: activity.name,
    backgroundColor: colors[index % colors.length],
    data: allMonths.map((month) => monthActivityMap[month][activity.id]),
  }));

  return {
    labels: allMonths,
    datasets,
  };
}
