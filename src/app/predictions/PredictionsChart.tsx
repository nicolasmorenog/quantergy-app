"use client";

import { useState } from "react";

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

import styles from "./PredictionsChart.module.css";

const TIME_RANGE_PRESETS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  all: "All time",
} as const;

type PredictionChartPoint = {
  id: number;
  date: string;
  value_predicted: number;
  value_real: number | null;
  error_percent: number | null;
};

type PredictionsChartProps = {
  data: PredictionChartPoint[];
};

export function PredictionsChart({ data }: PredictionsChartProps) {
  const [selectedRange, setSelectedRange] =
    useState<keyof typeof TIME_RANGE_PRESETS>("7d");
  const chartData = [...data].sort((a, b) => a.date.localeCompare(b.date));

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
            {Object.entries(TIME_RANGE_PRESETS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section>
        <ChartCard
          title={`Prediction vs Real - ${TIME_RANGE_PRESETS[selectedRange]}`}
        >
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
            <YAxis domain={[130, 150]} width={36} tickMargin={4}/>

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
        </ChartCard>
      </section>
    </div>
  );
}
