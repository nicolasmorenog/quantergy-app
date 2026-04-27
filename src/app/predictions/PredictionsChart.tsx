"use client";

import { LineGraph } from "@/components/common/LineGraph/LineGraph";
import {
  CHART_TIME_RANGE_PRESETS,
  type ChartTimeRange,
} from "@/lib/charts/timeRanges";

const PREDICTION_TIME_RANGES: ChartTimeRange[] = [
  "nextWeek",
  "7d",
  "30d",
  "6m",
  "all",
];

type PredictionChartPoint = {
  id: number;
  date: string;
  value_predicted: number;
  value_real: number | null;
};

type PredictionsChartProps = {
  data: PredictionChartPoint[];
  clientControl?: React.ReactNode;
};

export function PredictionsChart({
  clientControl,
  data,
}: PredictionsChartProps) {
  return (
    <LineGraph
      data={data}
      ranges={PREDICTION_TIME_RANGES}
      selectLabel="Prediction time range"
      title={(range) => `Prediction vs Real - ${CHART_TIME_RANGE_PRESETS[range]}`}
      toolbarStart={clientControl}
      yAxis={{ domain: [130, 150], width: 36, tickMargin: 4 }}
      margin={{ top: 20, right: 12, left: 0, bottom: 10 }}
      lines={[
        {
          dataKey: "value_predicted",
          name: "Predicted",
          stroke: "var(--chart-2)",
          strokeWidth: 1.5,
          dot: { r: 2 },
          activeDot: { r: 4 },
        },
        {
          dataKey: "value_real",
          name: "Real",
          stroke: "var(--chart-1)",
          strokeWidth: 1.5,
          dot: { r: 2 },
          activeDot: { r: 4 },
        },
      ]}
    />
  );
}
