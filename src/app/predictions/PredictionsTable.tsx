"use client";

import { useState } from "react";
import type { PredictionItem } from "@/lib/predictions/predictions";
import { useMediaQuery } from "@/lib/useMediaQuery";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import styles from "./page.module.css";

type PredictionTableProps = {
  predictions: PredictionItem[];
};

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";
const DESKTOP_ROWS_PER_PAGE = 11;

export function PredictionsTable({ predictions }: PredictionTableProps) {
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionItem | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  const totalPages = isDesktop
    ? Math.ceil(predictions.length / DESKTOP_ROWS_PER_PAGE)
    : 1;
  const paginatedPredictions = isDesktop
    ? predictions.slice(
        (page - 1) * DESKTOP_ROWS_PER_PAGE,
        page * DESKTOP_ROWS_PER_PAGE,
      )
    : predictions;

  if (predictions.length === 0) {
    return (
      <Card className={styles.tableCard}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            Latest energy predictions
          </CardTitle>
        </CardHeader>

        <CardContent className={styles.tableContent}>
          <p className={styles.subtitle}>No predictions available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const handleRowClick = (prediction: PredictionItem) => {
    setSelectedPrediction(prediction);
    setOpen(true);
  };

  return (
    <>
      <Card className={styles.tableCard}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            Latest energy predictions
          </CardTitle>
        </CardHeader>

        <CardContent className={styles.tableContent}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead className={styles.desktopOnlyColumn}>
                  Real value
                </TableHead>
                <TableHead className={styles.desktopOnlyColumn}>
                  Difference
                </TableHead>
                <TableHead>Error %</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedPredictions.map((prediction) => (
                <TableRow
                  key={prediction.id}
                  onClick={() => handleRowClick(prediction)}
                  className={styles.clickableRow}
                >
                  <TableCell>{prediction.predictionDate}</TableCell>
                  <TableCell>
                    {prediction.predictedValue} {prediction.client.unit}
                  </TableCell>
                  <TableCell className={styles.desktopOnlyColumn}>
                    {prediction.realValue === null
                      ? "-"
                      : `${prediction.realValue} ${prediction.client.unit}`}
                  </TableCell>
                  <TableCell className={styles.desktopOnlyColumn}>
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
                ))}
              </TableBody>
            </Table>
          

          {isDesktop && totalPages > 1 && (
            <Pagination className={styles.pagination}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
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
                      setPage((current) => Math.min(current + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
