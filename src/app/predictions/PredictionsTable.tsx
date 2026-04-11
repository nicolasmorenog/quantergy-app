"use client";

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
  DialogDescription,
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

const predictionRows: PredictionRow[] = [
  {
    id: 1,
    date: "10-04-26",
    prediction: "139.1 MWh",
    error: "1.41%",
    realValue: "137.2 MWh",
    difference: "+1.9 MWh",
  },
  {
    id: 2,
    date: "09-04-26",
    prediction: "142.3 MWh",
    error: "0.89%",
    realValue: "141.0 MWh",
    difference: "+1.3 MWh",
  },
  {
    id: 3,
    date: "08-04-26",
    prediction: "145.8 MWh",
    error: "2.58%",
    realValue: "142.1 MWh",
    difference: "+3.7 MWh",
  },
  {
    id: 4,
    date: "07-04-26",
    prediction: "137.6 MWh",
    error: "1.69%",
    realValue: "135.3 MWh",
    difference: "+2.3 MWh",
  },
  {
    id: 5,
    date: "06-04-26",
    prediction: "141.2 MWh",
    error: "0.94%",
    realValue: "139.9 MWh",
    difference: "+1.3 MWh",
  },
];

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={styles.dialogContent}>
          {selectedRow && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <strong>Prediction details</strong>
                </DialogTitle>
                <DialogDescription>
                  Detailed forecast information for {selectedRow.date}.
                </DialogDescription>
              </DialogHeader>

              <div className={styles.dialogBody}>
                <div className={styles.detailItem}>
                  <span>Date: </span>
                  <strong>{selectedRow.date}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Prediction: </span>
                  <strong>{selectedRow.prediction}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Real value: </span>
                  <strong>{selectedRow.realValue}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Difference: </span>
                  <strong>{selectedRow.difference}</strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Error: </span>
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
