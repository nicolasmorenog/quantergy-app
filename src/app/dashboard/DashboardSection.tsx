import dashboardStats from "@/app/mocks/dashboard.json";
import { StatsCard } from "@/components/common/StatsCard/StatsCard";

import styles from "./page.module.css";

const formattedToday = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date());

export function DashboardSection() {
  return (
    <div className={styles.sectionStack}>
      <div>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Today&apos;s overview — {formattedToday}
        </p>
      </div>

      <div className={styles.statsGrid}>
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            deltaPositive={stat.deltaPositive}
          />
        ))}
      </div>
    </div>
  );
}
