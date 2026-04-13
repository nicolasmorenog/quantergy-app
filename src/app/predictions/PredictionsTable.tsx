"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchPredictions, type PredictionDto } from "@/lib/predictions";

import styles from "./page.module.css";

export function PredictionTable() {
  const [predictions, setPredictions] = useState<PredictionDto[]>([]);
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionDto | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      try {
        const data = await fetchPredictions();

        if (cancelled) {
          return;
        }

        setPredictions(data.predictions);
        setError("");
      } catch {
        if (!cancelled) {
          setError("Could not load predictions.");
        }
      }
    }

    loadPredictions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRowClick = (prediction: PredictionDto) => {
    setSelectedPrediction(prediction);
    setOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={styles.title}>
            Latest energy predictions
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <p className={styles.subtitle} role="alert">
              {error}
            </p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Error %</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {predictions.map((prediction) => (
                <TableRow
                  key={prediction.id}
                  onClick={() => handleRowClick(prediction)}
                  className={styles.clickableRow}
                >
                  <TableCell>{prediction.predictionDate}</TableCell>
                  <TableCell>
                    {prediction.predictedValue} {prediction.client.unit}
                  </TableCell>
                  <TableCell>
                    {prediction.errorPercent === null
                      ? "-"
                      : `${prediction.errorPercent}%`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setSelectedPrediction(null);
          }
        }}
      >
        <DialogContent>
          {selectedPrediction && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Prediction details for {selectedPrediction.predictionDate}
                </DialogTitle>
              </DialogHeader>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span>Date</span>
                  <strong>{selectedPrediction.predictionDate}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Prediction</span>
                  <strong>
                    {selectedPrediction.predictedValue}{" "}
                    {selectedPrediction.client.unit}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Real value</span>
                  <strong>
                    {selectedPrediction.realValue === null
                      ? "-"
                      : `${selectedPrediction.realValue} ${selectedPrediction.client.unit}`}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Difference</span>
                  <strong>
                    {selectedPrediction.difference === null
                      ? "-"
                      : `${selectedPrediction.difference > 0 ? "+" : ""}${selectedPrediction.difference} ${selectedPrediction.client.unit}`}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Error</span>
                  <strong>
                    {selectedPrediction.errorPercent === null
                      ? "-"
                      : `${selectedPrediction.errorPercent}%`}
                  </strong>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
