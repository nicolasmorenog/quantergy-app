import initialMocks from "@/app/mocks/mocks.json";
import styles from "./page.module.css";

import { PredictionsChart } from "./PredictionsChart";
import { PredictionTable } from "./PredictionsTable";

export default function PredictionsPage() {
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>Predictions</h1>
        <p className={styles.subtitle}>
          Compare forecasted energy values with actual results.
        </p>
      </div>

      <PredictionsChart data={initialMocks.predictions} />
      <PredictionTable />
    </div>
  );
}
