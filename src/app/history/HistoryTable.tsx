import historyData from "@/app/mocks/history.json";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import styles from "./page.module.css";

type HistoryRow = {
  date: string;
  price: number;
};

export function HistoryTable() {
  const rows = [...historyData].sort((a, b) => b.date.localeCompare(a.date));

  if (rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Latest market prices</CardTitle>
        </CardHeader>

        <CardContent>
          <p className={styles.subtitle}>No market prices available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.cardTitle}>Latest market prices</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row: HistoryRow) => (
              <TableRow key={row.date}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.price} €/MWh</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
