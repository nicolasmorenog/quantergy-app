"use client";

import historyData from "@/app/mocks/history.json";
import { LineGraph } from "@/components/common/LineGraph/LineGraph";
import {
  CHART_TIME_RANGE_PRESETS,
  type ChartTimeRange,
} from "@/lib/charts/timeRanges";

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
  return (
    <LineGraph
      data={historyData}
      ranges={HISTORY_TIME_RANGES}
      selectLabel="History time range"
      title={(range) => `Market price history - ${CHART_TIME_RANGE_PRESETS[range]}`}
      yAxis={{ domain: [80, 100], width: 42, tickMargin: 4 }}
      lines={[
        {
          dataKey: "price",
          name: "Market price",
          stroke: "var(--chart-1)",
          strokeWidth: "var(--q-chart-line-stroke-width)",
          dot: ChartDot,
          activeDot: ActiveChartDot,
          unit: " €/MWh",
        },
      ]}
    />
  );
}
