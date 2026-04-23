"use client";

import { useMemo, useState } from "react";

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

import styles from "./PredictionsChart.module.css";

const PREDICTION_TIME_RANGES: ChartTimeRange[] = ["7d", "30d", "6m", "all"];

type PredictionChartPoint = {
  id: number;
  date: string;
  value_predicted: number;
  value_real: number | null;
};

type PredictionsChartProps = {
  data: PredictionChartPoint[];
};

export function PredictionsChart({ data }: PredictionsChartProps) {
  const [selectedRange, setSelectedRange] = useState<ChartTimeRange>("7d");
  const chartData = useMemo(
    () => filterDataByTimeRange(data, selectedRange),
    [data, selectedRange],
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
            aria-label="Prediction time range"
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
            {PREDICTION_TIME_RANGES.map((value) => (
              <SelectItem key={value} value={value}>
                {CHART_TIME_RANGE_PRESETS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section>
        <ChartCard
          title={`Prediction vs Real - ${CHART_TIME_RANGE_PRESETS[selectedRange]}`}
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
                  aspectRatio: 1.8,
                }}
                margin={{ top: 20, right: 12, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="4 4" />

                <XAxis dataKey="date" />
                <YAxis domain={[130, 150]} width={36} tickMargin={4} />

                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="value_predicted"
                  name="Predicted"
                  stroke="var(--chart-2)"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="value_real"
                  name="Real"
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            )}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
