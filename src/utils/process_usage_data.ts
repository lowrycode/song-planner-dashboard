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
  const [day, month, year] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function prepareUsageData(
  usages: { used_on: string; used_at: string }[],
  start: Date,
  end: Date
) {
  const allMonths = generateMonthRange(start, end);

  const venues = Array.from(new Set(usages.map(u => u.used_at)));

  // build month→venue→count structure
  const monthVenueMap: Record<string, Record<string, number>> = {};

  allMonths.forEach(month => {
    monthVenueMap[month] = {};
    venues.forEach(v => (monthVenueMap[month][v] = 0));
  });

  // fill actual usage
  usages.forEach(({ used_on, used_at }) => {
    const month = formatMonth(used_on);
    if (monthVenueMap[month]) {
      monthVenueMap[month][used_at]++;
    }
  });

  const datasets = venues.map((venue, i) => ({
    label: venue,
    backgroundColor: ["#3b82f6", "#10b981", "#f97316", "#e11d48"][i],
    data: allMonths.map(m => monthVenueMap[m][venue]),
  }));

  return { labels: allMonths, datasets };
}


