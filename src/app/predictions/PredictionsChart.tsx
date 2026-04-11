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
import styles from "./PredictionsChart.module.css";

const TIME_RANGE_PRESETS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  "all": "All time",
} as const;

export function PredictionsChart() {
  const [selectedRange, setSelectedRange] =
    useState<keyof typeof TIME_RANGE_PRESETS>("7d");

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
        />
      </section>
    </div>
  );
}
