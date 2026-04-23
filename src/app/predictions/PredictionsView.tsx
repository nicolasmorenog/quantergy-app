"use client";

import { useEffect, useState } from "react";

import {
  fetchPredictions,
  type PredictionItem,
} from "@/lib/predictions/predictions";

import styles from "./page.module.css";

import { PredictionsChart } from "./PredictionsChart";
import { PredictionsTable } from "./PredictionsTable";

export function PredictionsView() {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPredictions() {
      try {
        const data = await fetchPredictions();
        setPredictions(data.predictions);
        setError("");
      } catch {
        setError("Could not load predictions.");
      }
    }

    loadPredictions();
  }, []);

  const chartData = predictions.map((prediction) => ({
    id: prediction.id,
    date: prediction.predictionDate,
    value_predicted: prediction.predictedValue,
    value_real: prediction.realValue,
  }));

  return (
    <>
      {error && (
        <p className={styles.subtitle} role="alert">
          {error}
        </p>
      )}

      <div className={styles.contentGrid}>
        <PredictionsChart data={chartData} />
        <PredictionsTable predictions={predictions} />
      </div>
    </>
  );
}
