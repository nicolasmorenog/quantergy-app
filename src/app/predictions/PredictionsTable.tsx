"use client";

import initialMocks from "@/app/mocks/mocks.json";
import { useState } from "react";
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

type PredictionRow = {
  id: number;
  date: string;
  prediction: string;
  error: string;
  realValue: string;
  difference: string;
};

const formatSignedValue = (value: number, unit: string) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)} ${unit}`;

const predictionRows: PredictionRow[] = initialMocks.predictions.map(
  (prediction) => {
    const realValue =
      prediction.value_real === null
        ? "-"
        : `${prediction.value_real} ${initialMocks.unit}`;
    const difference =
      prediction.value_real === null
        ? "-"
        : formatSignedValue(
            prediction.value_predicted - prediction.value_real,
            initialMocks.unit,
          );

    return {
      id: prediction.id,
      date: prediction.date,
      prediction: `${prediction.value_predicted} ${initialMocks.unit}`,
      error:
        prediction.error_percent === null ? "-" : `${prediction.error_percent}%`,
      realValue,
      difference,
    };
  },
);

export function PredictionTable() {
  const [selectedRow, setSelectedRow] = useState<PredictionRow | null>(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = (row: PredictionRow) => {
    setSelectedRow(row);
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
              {predictionRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className={styles.clickableRow}
                >
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.prediction}</TableCell>
                  <TableCell>{row.error}</TableCell>
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
            setSelectedRow(null);
          }
        }}
      >
        <DialogContent>
          {selectedRow && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Prediction details for {selectedRow.date}
                </DialogTitle>
              </DialogHeader>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span>Date</span>
                  <strong>{selectedRow.date}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Prediction</span>
                  <strong>{selectedRow.prediction}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Real value</span>
                  <strong>{selectedRow.realValue}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Difference</span>
                  <strong>{selectedRow.difference}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Error</span>
                  <strong>{selectedRow.error}</strong>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
