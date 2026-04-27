"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/ChartCard/ChartCard";
import {
  CHART_TIME_RANGE_PRESETS,
  filterDataByTimeRange,
  type ChartTimeRange,
} from "@/lib/charts/timeRanges";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import styles from "./LineGraph.module.css";

type ChartEntry = {
  date: string;
};

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

type LineGraphProps<T extends ChartEntry> = {
  data: T[];
  defaultRange?: ChartTimeRange;
  lines: React.ComponentProps<typeof Line>[];
  margin?: React.ComponentProps<typeof LineChart>["margin"];
  ranges: ChartTimeRange[];
  selectLabel: string;
  title: (range: ChartTimeRange) => string;
  toolbarStart?: React.ReactNode;
  yAxis: React.ComponentProps<typeof YAxis>;
};

export function LineGraph<T extends ChartEntry>({
  data,
  defaultRange = "7d",
  lines,
  margin = { top: 20, right: 0, left: 0, bottom: 10 },
  ranges,
  selectLabel,
  title,
  toolbarStart,
  yAxis,
}: LineGraphProps<T>) {
  const [selectedRange, setSelectedRange] =
    useState<ChartTimeRange>(defaultRange);
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const chartData = useMemo(
    () => filterDataByTimeRange(data, selectedRange),
    [data, selectedRange],
  );
  const topToolbarStart = isDesktop ? null : toolbarStart;
  const bottomToolbarStart = isDesktop ? toolbarStart : null;

  return (
    <div className={styles.view}>
      <div
        className={styles.toolbar}
        data-has-start={topToolbarStart ? "true" : undefined}
      >
        {topToolbarStart && (
          <div className={styles.toolbarStart}>{topToolbarStart}</div>
        )}
        <div className={styles.toolbarEnd}>
          <Select
            value={selectedRange}
            onValueChange={(value) => setSelectedRange(value as ChartTimeRange)}
          >
            <SelectTrigger
              size="sm"
              aria-label={selectLabel}
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
              {ranges.map((value) => (
                <SelectItem key={value} value={value}>
                  {CHART_TIME_RANGE_PRESETS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChartCard title={title(selectedRange)}>
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
              margin={margin}
            >
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis dataKey="date" />
              <YAxis {...yAxis} />

              <Tooltip />
              <Legend />

              {lines.map((line) => (
                <Line key={String(line.dataKey)} type="monotone" {...line} />
              ))}
            </LineChart>
          )}
        </div>
        {bottomToolbarStart && (
          <div className={styles.desktopToolbarStart}>
            {bottomToolbarStart}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
