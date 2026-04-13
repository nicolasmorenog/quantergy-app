"use client";

import { useMemo, useState } from "react";

import { ChartCard } from "@/components/common/ChartCard/ChartCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import styles from "./HistoryChart.module.css";

const historyData = [
  { date: "24-01-01", price: 84.2 },
  { date: "24-02-01", price: 86.5 },
  { date: "24-03-01", price: 83.9 },
  { date: "24-04-01", price: 87.1 },
  { date: "24-05-01", price: 88.4 },
  { date: "24-06-01", price: 85.8 },
  { date: "24-07-01", price: 89.6 },
  { date: "24-08-01", price: 92.3 },
  { date: "24-09-01", price: 90.7 },
  { date: "24-10-01", price: 93.5 },
  { date: "24-11-01", price: 91.8 },
  { date: "24-12-01", price: 95.2 },
  { date: "25-01-01", price: 94.6 },
  { date: "25-02-01", price: 92.1 },
  { date: "25-03-01", price: 90.4 },
  { date: "25-04-01", price: 88.9 },
  { date: "25-05-01", price: 91.5 },
  { date: "25-06-01", price: 93.2 },
  { date: "25-07-01", price: 95.7 },
  { date: "25-08-01", price: 97.4 },
  { date: "25-09-01", price: 96.2 },
  { date: "25-10-01", price: 94.8 },
  { date: "25-11-01", price: 92.6 },
  { date: "25-12-01", price: 90.9 },
  { date: "26-01-01", price: 89.4 },
  { date: "26-02-01", price: 91.8 },
  { date: "26-03-15", price: 93.2 },
  { date: "26-03-22", price: 95.6 },
  { date: "26-03-29", price: 92.7 },
  { date: "26-04-01", price: 82.4 },
  { date: "26-04-02", price: 85.1 },
  { date: "26-04-03", price: 83.7 },
  { date: "26-04-04", price: 88.9 },
  { date: "26-04-05", price: 91.2 },
  { date: "26-04-06", price: 89.6 },
  { date: "26-04-07", price: 94.3 },
  { date: "26-04-08", price: 96.8 },
  { date: "26-04-09", price: 93.5 },
  { date: "26-04-10", price: 98.1 },
];

const TIME_RANGE_PRESETS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  "1y": "Last year",
  all: "All time",
} as const;

type ChartDotProps = {
  cx?: number;
  cy?: number;
  stroke?: string;
};

function ChartDot({ cx, cy, stroke }: ChartDotProps) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r="var(--q-chart-dot-radius)"
      fill="var(--card)"
      stroke={stroke ?? "var(--chart-1)"}
      strokeWidth="var(--q-chart-line-stroke-width)"
    />
  );
}

function ActiveChartDot({ cx, cy, stroke }: ChartDotProps) {
  if (typeof cx !== "number" || typeof cy !== "number") return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r="var(--q-chart-active-dot-radius)"
      fill="var(--card)"
      stroke={stroke ?? "var(--chart-1)"}
      strokeWidth="var(--q-chart-line-stroke-width)"
    />
  );
}

const parseHistoryDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(2000 + year, month - 1, day);
};

const getRangeStart = (
  range: keyof typeof TIME_RANGE_PRESETS,
  latestDate: Date,
) => {
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
};

export default function HistoryChart() {
  const [selectedRange, setSelectedRange] =
    useState<keyof typeof TIME_RANGE_PRESETS>("7d");
  const chartData = useMemo(() => {
    const sortedHistoryData = [...historyData].sort(
      (a, b) =>
        parseHistoryDate(a.date).getTime() -
        parseHistoryDate(b.date).getTime(),
    );
    const latestDate = parseHistoryDate(
      sortedHistoryData[sortedHistoryData.length - 1].date,
    );
    const rangeStart = getRangeStart(selectedRange, latestDate);

    if (!rangeStart) return sortedHistoryData;

    return sortedHistoryData.filter(
      (entry) => parseHistoryDate(entry.date) >= rangeStart,
    );
  }, [selectedRange]);

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        <Select
          value={selectedRange}
          onValueChange={(value) =>
            setSelectedRange(value as keyof typeof TIME_RANGE_PRESETS)
          }
        >
          <SelectTrigger
            size="sm"
            aria-label="History time range"
            className={styles.selectTrigger}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            avoidCollisions={false}
          >
            {Object.entries(TIME_RANGE_PRESETS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartCard
        title={`Market price history - ${TIME_RANGE_PRESETS[selectedRange]}`}
      >
        <div className={styles.chartFrame}>
          <LineChart
            responsive
            data={chartData}
            style={{
              width: "100%",
              maxWidth: "100%",
              aspectRatio: 1.8,
            }}
            margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="date" />
            <YAxis domain={[80, 100]} width={42} tickMargin={4} />

            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="price"
              name="Market price"
              stroke="var(--chart-1)"
              strokeWidth="var(--q-chart-line-stroke-width)"
              dot={ChartDot}
              activeDot={ActiveChartDot}
              unit=" €/MWh"
            />
          </LineChart>
        </div>
      </ChartCard>
    </div>
  );
}
