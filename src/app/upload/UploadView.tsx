"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

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
  deletePrediction,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [predictionToDelete, setPredictionToDelete] =
    useState<PredictionItem | null>(null);
  const [error, setError] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deletingPredictionId, setDeletingPredictionId] = useState<
    number | null
  >(null);
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

  const handleUploadPredictions = async (payload: PredictionsUploadPayload) => {
    await uploadPredictions(payload);
    setReloadToken((current) => current + 1);
  };

  const handleDeleteAllPredictions = async () => {
    try {
      setIsDeletingAll(true);
      await deleteAllPredictions();
      setDeleteDialogOpen(false);
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

  const handleDeletePrediction = async () => {
    if (!predictionToDelete) {
      return;
    }

    try {
      setDeletingPredictionId(predictionToDelete.id);
      await deletePrediction(predictionToDelete.id);
      setPredictions((current) =>
        current.filter((prediction) => prediction.id !== predictionToDelete.id),
      );
      setPredictionToDelete(null);
      setError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete prediction.",
      );
    } finally {
      setDeletingPredictionId(null);
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
                    <TableHead className={styles.desktopOnly}>
                      Difference
                    </TableHead>
                    <TableHead className={styles.desktopOnly}>
                      Error %
                    </TableHead>
                    <TableHead className={styles.actionsColumn}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {predictions.map((prediction) => {
                    const isRecent = isRecentlyCreated(prediction.createdAt);

                    return (
                      <TableRow
                        key={prediction.id}
                        className={styles.dataRow}
                        data-recent={isRecent}
                      >
                        <TableCell>{prediction.predictionDate}</TableCell>
                        <TableCell>{prediction.predictedValue}</TableCell>
                        <TableCell>{prediction.realValue ?? "-"}</TableCell>
                        <TableCell className={styles.desktopOnly}>
                          {prediction.difference === null
                            ? "-"
                            : `${prediction.difference > 0 ? "+" : ""}${prediction.difference} ${prediction.client.unit}`}
                        </TableCell>
                        <TableCell className={styles.desktopOnly}>
                          {prediction.errorPercent === null
                            ? "-"
                            : `${prediction.errorPercent}%`}
                        </TableCell>
                        <TableCell className={styles.actionsColumn}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete prediction for ${prediction.predictionDate}`}
                            className={styles.deleteButton}
                            disabled={deletingPredictionId === prediction.id}
                            onClick={() => setPredictionToDelete(prediction)}
                          >
                            <Trash2 />
                          </Button>
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all predictions?</DialogTitle>
            <DialogDescription>
              This will permanently remove every stored prediction. Clients will
              not be deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row justify-end">
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={predictionToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPredictionToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {predictionToDelete
                ? `Delete the prediction for ${predictionToDelete.predictionDate}?`
                : ""}
            </DialogTitle>
            <DialogDescription>
              This will permanently remove the selected prediction.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPredictionToDelete(null)}
              disabled={deletingPredictionId !== null}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDeletePrediction()}
              disabled={deletingPredictionId !== null}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
