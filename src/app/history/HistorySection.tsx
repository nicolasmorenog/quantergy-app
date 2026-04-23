import styles from "./page.module.css";

import { HistoryChart } from "./HistoryChart";
import { HistoryTable } from "./HistoryTable";

export function HistorySection() {
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>History</h1>
        <p className={styles.subtitle}>
          View historical market prices over time.
        </p>
      </div>
      <div className={styles.contentGrid}>
        <HistoryChart />
        <HistoryTable />
      </div>
    </div>
  );
}
