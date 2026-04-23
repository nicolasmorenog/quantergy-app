export const CHART_TIME_RANGE_PRESETS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  "1y": "Last year",
  all: "All time",
} as const;

export type ChartTimeRange = keyof typeof CHART_TIME_RANGE_PRESETS;

type DatedEntry = {
  date: string;
};

export function parseApiDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getRangeStart(range: ChartTimeRange, referenceDate: Date) {
  const rangeStart = new Date(referenceDate);

  switch (range) {
    case "7d":
      rangeStart.setDate(referenceDate.getDate() - 6);
      return rangeStart;
    case "30d":
      rangeStart.setDate(referenceDate.getDate() - 29);
      return rangeStart;
    case "6m":
      rangeStart.setMonth(referenceDate.getMonth() - 6);
      return rangeStart;
    case "1y":
      rangeStart.setFullYear(referenceDate.getFullYear() - 1);
      return rangeStart;
    case "all":
      return null;
  }
}

export function filterDataByTimeRange<T extends DatedEntry>(
  data: T[],
  range: ChartTimeRange,
) {
  const sortedData = [...data].sort(
    (a, b) => parseApiDate(a.date).getTime() - parseApiDate(b.date).getTime(),
  );

  if (sortedData.length === 0) {
    return sortedData;
  }

  if (range === "all") {
    return sortedData;
  }

  const today = startOfDay(new Date());
  const rangeStart = getRangeStart(range, today);

  return sortedData.filter((entry) => {
    const entryDate = parseApiDate(entry.date);

    return entryDate >= rangeStart && entryDate <= today;
  });
}
