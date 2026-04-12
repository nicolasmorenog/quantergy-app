"use client";

import initialMocks from "@/app/mocks/mocks.json";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UploadFileInput } from "./UploadFileInput";
import styles from "./UploadView.module.css";

type PredictionUploadRow = {
  id: number;
  date: string;
  value_predicted: number;
  value_real: number | null;
  error_percent: number | null;
};

const sortPredictionsByDate = (predictions: PredictionUploadRow[]) =>
  [...predictions].sort((a, b) => a.date.localeCompare(b.date));

export function UploadView() {
  const [predictions, setPredictions] = useState<PredictionUploadRow[]>(
    () => sortPredictionsByDate(initialMocks.predictions),
  );
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionUploadRow | null>(null);

  const handleUploadPredictions = (
    uploadedPredictions: PredictionUploadRow[],
  ) => {
    setPredictions((currentPredictions) => {
      const nextId =
        currentPredictions.reduce(
          (maxId, prediction) => Math.max(maxId, prediction.id),
          0,
        ) + 1;

      const predictionsToAppend = uploadedPredictions.map(
        (prediction, index) => ({
          ...prediction,
          id: nextId + index,
        }),
      );

      return sortPredictionsByDate(
        [...currentPredictions, ...predictionsToAppend],
      );
    });
  };

  const selectedDifference =
    selectedPrediction?.value_real === null || !selectedPrediction
      ? null
      : selectedPrediction.value_predicted - selectedPrediction.value_real;

  return (
    <div className={styles.view}>
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Predictions</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead>Real value</TableHead>
                  <TableHead>Error %</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {predictions.map((prediction) => (
                  <TableRow
                    key={prediction.id}
                    className={styles.clickableRow}
                    data-selected={selectedPrediction?.id === prediction.id}
                    onClick={() => setSelectedPrediction(prediction)}
                  >
                    <TableCell>{prediction.date}</TableCell>
                    <TableCell>{prediction.value_predicted}</TableCell>
                    <TableCell>{prediction.value_real ?? "-"}</TableCell>
                    <TableCell>{prediction.error_percent ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={selectedPrediction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPrediction(null);
          }
        }}
      >
        <DialogContent>
          {selectedPrediction && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Prediction details for {selectedPrediction.date}
                </DialogTitle>
              </DialogHeader>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span>Date</span>
                  <strong>{selectedPrediction.date}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Prediction</span>
                  <strong>
                    {selectedPrediction.value_predicted} {initialMocks.unit}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Real value</span>
                  <strong>
                    {selectedPrediction.value_real === null
                      ? "-"
                      : `${selectedPrediction.value_real} ${initialMocks.unit}`}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Difference</span>
                  <strong>
                    {selectedDifference === null
                      ? "-"
                      : `${selectedDifference.toFixed(1)} ${initialMocks.unit}`}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Error</span>
                  <strong>
                    {selectedPrediction.error_percent === null
                      ? "-"
                      : `${selectedPrediction.error_percent}%`}
                  </strong>
                </div>

                <div className={styles.detailsActions}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit prediction"
                    disabled
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    aria-label="Delete prediction"
                    disabled
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <UploadFileInput onUpload={handleUploadPredictions} />
    </div>
  );
}
