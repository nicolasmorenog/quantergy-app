"use client";

import { useMemo, useState } from "react";

import historyData from "@/app/mocks/history.json";
import { ChartCard } from "@/components/common/ChartCard/ChartCard";
import {
  CHART_TIME_RANGE_PRESETS,
  filterDataByTimeRange,
  type ChartTimeRange,
} from "@/lib/charts/timeRanges";
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

const HISTORY_TIME_RANGES: ChartTimeRange[] = ["7d", "30d", "6m", "1y", "all"];

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

export function HistoryChart() {
  const [selectedRange, setSelectedRange] = useState<ChartTimeRange>("7d");
  const chartData = useMemo(
    () => filterDataByTimeRange(historyData, selectedRange),
    [selectedRange],
  );

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        <Select
          value={selectedRange}
          onValueChange={(value) => setSelectedRange(value as ChartTimeRange)}
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
            {HISTORY_TIME_RANGES.map((value) => (
              <SelectItem key={value} value={value}>
                {CHART_TIME_RANGE_PRESETS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartCard
        title={`Market price history - ${CHART_TIME_RANGE_PRESETS[selectedRange]}`}
      >
        <div className={styles.chartFrame}>
          {chartData.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                No data available for this time range.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </ChartCard>
    </div>
  );
}
