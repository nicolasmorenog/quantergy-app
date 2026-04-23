import styles from "./page.module.css";

import { PredictionsView } from "./PredictionsView";

export function PredictionsSection() {
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>Predictions</h1>
        <p className={styles.subtitle}>
          Compare forecasted energy values with actual results.
        </p>
      </div>

      <PredictionsView />
    </div>
  );
}
