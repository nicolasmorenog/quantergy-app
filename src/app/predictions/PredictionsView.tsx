"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchPredictions,
  type PredictionItem,
} from "@/lib/predictions/predictions";
import { ClientTabs } from "@/components/common/ClientTabs/ClientTabs";

import styles from "./page.module.css";

import { PredictionsChart } from "./PredictionsChart";
import { PredictionsTable } from "./PredictionsTable";

export function PredictionsView() {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [error, setError] = useState("");
  const [selectedClientExternalId, setSelectedClientExternalId] =
    useState("1");

  useEffect(() => {
    async function loadPredictions() {
      try {
        const data = await fetchPredictions();
        setPredictions(data.predictions);
        setError("");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load predictions."
        );
      }
    }

    loadPredictions();
  }, []);

  const clients = useMemo(() => {
    const clientsByExternalId = new Map<
      string,
      PredictionItem["client"]
    >();

    for (const prediction of predictions) {
      clientsByExternalId.set(
        prediction.client.externalId,
        prediction.client,
      );
    }

    return [...clientsByExternalId.values()].sort((a, b) =>
      a.externalId.localeCompare(b.externalId, undefined, { numeric: true }),
    );
  }, [predictions]);

  const activeClientExternalId = clients.some(
    (client) => client.externalId === selectedClientExternalId,
  )
    ? selectedClientExternalId
    : (clients[0]?.externalId ?? selectedClientExternalId);

  const filteredPredictions = useMemo(
    () =>
      predictions.filter(
        (prediction) =>
          prediction.client.externalId === activeClientExternalId,
      ),
    [activeClientExternalId, predictions],
  );

  const chartData = filteredPredictions.map((prediction) => ({
    id: prediction.id,
    date: prediction.predictionDate,
    value_predicted: prediction.predictedValue,
    value_real: prediction.realValue,
  }));

  const clientControl =
    clients.length > 1 ? (
      <ClientTabs
        value={activeClientExternalId}
        onValueChange={setSelectedClientExternalId}
        clients={clients.map((client) => ({
          value: client.externalId,
        }))}
      />
    ) : null;

  return (
    <>
      {error && (
        <p className={styles.subtitle} role="alert">
          {error}
        </p>
      )}

      <div className={styles.contentGrid}>
        <PredictionsChart data={chartData} clientControl={clientControl} />
        <PredictionsTable predictions={filteredPredictions} />
      </div>
    </>
  );
}
