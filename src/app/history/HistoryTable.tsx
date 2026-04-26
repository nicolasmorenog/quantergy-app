"use client";

import { useState } from "react";

import historyData from "@/app/mocks/history.json";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import styles from "./page.module.css";

type HistoryRow = {
  date: string;
  price: number;
};

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";
const DESKTOP_ROWS_PER_PAGE = 11;

export function HistoryTable() {
  const [page, setPage] = useState(1);
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const rows = [...historyData].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = isDesktop
    ? Math.ceil(rows.length / DESKTOP_ROWS_PER_PAGE)
    : 1;
  const paginatedRows = isDesktop
    ? rows.slice((page - 1) * DESKTOP_ROWS_PER_PAGE, page * DESKTOP_ROWS_PER_PAGE)
    : rows;

  if (rows.length === 0) {
    return (
      <Card className={styles.tableCard}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Latest market prices</CardTitle>
        </CardHeader>

        <CardContent className={styles.tableContent}>
          <p className={styles.subtitle}>No market prices available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.tableCard}>
      <CardHeader>
        <CardTitle className={styles.cardTitle}>Latest market prices</CardTitle>
      </CardHeader>

      <CardContent className={styles.tableContent}>
        <div className={styles.tableViewport}>
          <Table>
            <TableHeader className={styles.stickyTableHeader}>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedRows.map((row: HistoryRow) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.price} €/MWh</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
  );
}
