import { HistorySection } from "@/app/history/HistorySection";
import { PredictionsSection } from "@/app/predictions/PredictionsSection";

import { DashboardSection } from "./DashboardSection";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <>
      <div className={styles.mobileOnly}>
        <DashboardSection />
      </div>

      <div className={styles.desktopOnly}>
        <div className={styles.combinedPage}>
          <section id="dashboard" data-nav-section className={styles.section}>
            <DashboardSection />
          </section>

          <section
            id="predictions"
            data-nav-section
            className={styles.section}
          >
            <PredictionsSection />
          </section>

          <section id="history" data-nav-section className={styles.section}>
            <HistorySection />
          </section>
        </div>
      </div>
    </>
  );
}
