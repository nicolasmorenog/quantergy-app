"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  deleteAllPredictions,
  fetchPredictions,
  type PredictionItem,
  type PredictionsUploadPayload,
  uploadPredictions,
} from "@/lib/predictions/predictions";

import { UploadFileInput } from "./UploadFileInput";
import styles from "./UploadView.module.css";

const sortPredictionsByDate = (predictions: PredictionItem[]) =>
  [...predictions].sort((a, b) =>
    b.predictionDate.localeCompare(a.predictionDate),
  );

const RECENT_PREDICTION_MAX_AGE_MS = 10 * 60 * 1000;

const isRecentlyCreated = (createdAt: string) => {
  const createdAtTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTime)) {
    return false;
  }

  return Date.now() - createdAtTime < RECENT_PREDICTION_MAX_AGE_MS;
};

export function UploadView() {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      try {
        const data = await fetchPredictions();

        if (cancelled) {
          return;
        }

        setPredictions(sortPredictionsByDate(data.predictions));
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
  }, [reloadToken]);

  const handleUploadPredictions = async (
    payload: PredictionsUploadPayload,
  ) => {
    await uploadPredictions(payload);
    setSelectedPrediction(null);
    setReloadToken((current) => current + 1);
  };

  const handleDeleteAllPredictions = async () => {
    try {
      setIsDeletingAll(true);
      await deleteAllPredictions();
      setDeleteDialogOpen(false);
      setSelectedPrediction(null);
      setReloadToken((current) => current + 1);
      setError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete predictions.",
      );
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className={styles.view}>
      <div className={styles.contentGrid}>
        <div className={styles.sidebar}>
          <UploadFileInput onUpload={handleUploadPredictions} />

          <Card>
            <CardHeader>
              <CardTitle>Danger zone</CardTitle>
            </CardHeader>

            <CardContent className={styles.dangerZone}>
              <p className={styles.dangerText}>
                Delete all stored predictions. Clients will be kept.
              </p>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={predictions.length === 0}
              >
                Delete all predictions
              </Button>
            </CardContent>
          </Card>
        </div>

        {predictions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
            </CardHeader>

            <CardContent>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead>Real value</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Error %</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {predictions.map((prediction) => {
                    const isRecent = isRecentlyCreated(prediction.createdAt);

                    return (
                      <TableRow
                        key={prediction.id}
                        className={styles.clickableRow}
                        data-recent={isRecent}
                        data-selected={selectedPrediction?.id === prediction.id}
                        onClick={() => setSelectedPrediction(prediction)}
                      >
                        <TableCell>{prediction.predictionDate}</TableCell>
                        <TableCell>{prediction.predictedValue}</TableCell>
                        <TableCell>{prediction.realValue ?? "-"}</TableCell>
                        <TableCell>
                          {prediction.difference === null
                            ? "-"
                            : `${prediction.difference > 0 ? "+" : ""}${prediction.difference} ${prediction.client.unit}`}
                        </TableCell>
                        <TableCell>
                          {prediction.errorPercent === null
                            ? "-"
                            : `${prediction.errorPercent}%`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all predictions?</DialogTitle>
            <DialogDescription>
              This will permanently remove every stored prediction. Clients will
              not be deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeletingAll}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAllPredictions}
              disabled={isDeletingAll}
            >
              Delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
