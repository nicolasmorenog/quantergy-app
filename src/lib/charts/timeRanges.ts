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

export function getRangeStart(range: ChartTimeRange, latestDate: Date) {
  const rangeStart = new Date(latestDate);

  switch (range) {
    case "7d":
      rangeStart.setDate(latestDate.getDate() - 6);
      return rangeStart;
    case "30d":
      rangeStart.setDate(latestDate.getDate() - 29);
      return rangeStart;
    case "6m":
      rangeStart.setMonth(latestDate.getMonth() - 6);
      return rangeStart;
    case "1y":
      rangeStart.setFullYear(latestDate.getFullYear() - 1);
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

  const latestDate = parseApiDate(sortedData[sortedData.length - 1].date);
  const rangeStart = getRangeStart(range, latestDate);

  if (!rangeStart) {
    return sortedData;
  }

  return sortedData.filter((entry) => parseApiDate(entry.date) >= rangeStart);
}
