"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  deleteAllPredictions,
  deletePrediction,
  fetchPredictions,
  type PredictionItem,
  type PredictionsUploadPayload,
  uploadPredictions,
} from "@/lib/predictions/predictions";
import { useMediaQuery } from "@/lib/useMediaQuery";

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

const MOBILE_MEDIA_QUERY = "(max-width: 63.999rem)";
const DESKTOP_ROWS_PER_PAGE = 12;

const formatUploadDate = (date: string, isMobile: boolean) => {
  if (!isMobile || date.length < 10) {
    return date;
  }

  return date.slice(2);
};

export function UploadView() {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] =
    useState(false);
  const [predictionToDelete, setPredictionToDelete] =
    useState<PredictionItem | null>(null);
  const [error, setError] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [deletingPredictionId, setDeletingPredictionId] = useState<
    number | null
  >(null);
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const totalPages = Math.max(
    1,
    Math.ceil(predictions.length / DESKTOP_ROWS_PER_PAGE),
  );
  const paginatedPredictions = predictions.slice(
    (page - 1) * DESKTOP_ROWS_PER_PAGE,
    page * DESKTOP_ROWS_PER_PAGE,
  );
  const visiblePredictions = isMobile ? predictions : paginatedPredictions;

  const allSelected =
    predictions.length > 0 &&
    predictions.every((prediction) => selectedIds.includes(prediction.id));

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      try {
        const data = await fetchPredictions();

        if (cancelled) {
          return;
        }

        setPredictions(sortPredictionsByDate(data.predictions));
        setSelectedIds([]);
        setPage(1);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load predictions. Please refresh the page and try again."
          );
        }
      }
    }
    
    loadPredictions();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (isMobile && page !== 1) {
      setPage(1);
    }
  }, [isMobile, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleUploadPredictions = async (payload: PredictionsUploadPayload) => {
    await uploadPredictions(payload);
    setReloadToken((current) => current + 1);
  };

  const handleDeleteAllPredictions = async () => {
    try {
      setIsDeletingAll(true);
      await deleteAllPredictions();
      setDeleteDialogOpen(false);
      setSelectedIds([]);
      setPage(1);
      setReloadToken((current) => current + 1);
      setError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete predictions. Please refresh the page and try again.",
      );
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleToggleSelection = (id: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...current, id]
        : current.filter((selectedId) => selectedId !== id),
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedIds(() => {
      if (checked) {
        return predictions.map((prediction) => prediction.id);
      }

      return [];
    });
  };

  const handleOpenBulkDeleteDialog = () => {
    if (selectedIds.length === predictions.length) {
      setDeleteDialogOpen(true);
      return;
    }

    setDeleteSelectedDialogOpen(true);
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
      setSelectedIds((current) =>
        current.filter((selectedId) => selectedId !== predictionToDelete.id),
      );
      setPage((current) => Math.min(current, totalPages));
      setPredictionToDelete(null);
      setError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete prediction. Please refresh the page and try again.",
      );
    } finally {
      setDeletingPredictionId(null);
    }
  };

  const handleDeleteSelectedPredictions = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const idsToDelete = [...selectedIds];

    try {
      setIsDeletingSelected(true);

      for (const id of idsToDelete) {
        await deletePrediction(id);
      }

      setPredictions((current) =>
        current.filter((prediction) => !idsToDelete.includes(prediction.id)),
      );
      setSelectedIds([]);
      setPage(1);
      setDeleteSelectedDialogOpen(false);
      setError("");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete selected predictions. Please refresh the page and try again.",
      );
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const renderSelectionActions = (className: string) => (
    <div className={className}>
      {selectedIds.length > 0 && (
        <p className={styles.selectionCount}>{selectedIds.length} selected</p>
      )}

      <Button
        type="button"
        variant="destructive"
        disabled={selectedIds.length === 0}
        onClick={handleOpenBulkDeleteDialog}
      >
        Delete selected
      </Button>
    </div>
  );

  return (
    <div className={styles.view}>
      <div className={styles.contentGrid}>
        <div className={styles.sidebar}>
          <UploadFileInput onUpload={handleUploadPredictions} />
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

              <div className={styles.tableViewport}>
                <Table>
                  <TableHeader className={styles.stickyTableHeader}>
                    <TableRow>
                      <TableHead className={styles.checkboxColumn}>
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={(checked) =>
                            handleToggleSelectAll(checked === true)
                          }
                          aria-label="Select all predictions"
                        />
                      </TableHead>
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
                    {visiblePredictions.map((prediction) => {
                      const isRecent = isRecentlyCreated(prediction.createdAt);
                      const displayDate = formatUploadDate(
                        prediction.predictionDate,
                        isMobile,
                      );

                      return (
                        <TableRow
                          key={prediction.id}
                          className={styles.dataRow}
                          data-recent={isRecent}
                        >
                          <TableCell className={styles.checkboxColumn}>
                            <Checkbox
                              checked={selectedIds.includes(prediction.id)}
                              onCheckedChange={(checked) =>
                                handleToggleSelection(
                                  prediction.id,
                                  checked === true,
                                )
                              }
                              aria-label={`Select prediction for ${prediction.predictionDate}`}
                            />
                          </TableCell>
                          <TableCell>{displayDate}</TableCell>
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
              </div>

              <div className={styles.tableFooter}>
                {renderSelectionActions(styles.footerSelectionActions)}

                {!isMobile && totalPages > 1 ? (
                  <Pagination className={styles.pagination}>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setPage((current) => Math.max(current - 1, 1))
                          }
                          disabled={page === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;

                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={page === pageNumber}
                              onClick={() => setPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((current) =>
                              Math.min(current + 1, totalPages),
                            )
                          }
                          disabled={page === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : null}
              </div>
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
        open={deleteSelectedDialogOpen}
        onOpenChange={setDeleteSelectedDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete selected predictions?</DialogTitle>
            <DialogDescription>
              This will permanently remove the selected predictions.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteSelectedDialogOpen(false)}
              disabled={isDeletingSelected}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDeleteSelectedPredictions()}
              disabled={isDeletingSelected}
            >
              Delete selected
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
