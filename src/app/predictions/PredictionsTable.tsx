"use client";

import { useState } from "react";
import type { PredictionItem } from "@/lib/predictions/predictions";
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

import styles from "./page.module.css";

type PredictionTableProps = {
  predictions: PredictionItem[];
};

export function PredictionsTable({ predictions }: PredictionTableProps) {
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionItem | null>(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = (prediction: PredictionItem) => {
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
