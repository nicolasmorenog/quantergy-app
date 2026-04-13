import styles from "./page.module.css";

import HistoryChart from "./HistoryChart";

export default function HistoryPage() {
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>History</h1>
        <p className={styles.subtitle}>
          View historical market prices over time.
        </p>
      </div>
      <HistoryChart />
    </div>
  );
}
