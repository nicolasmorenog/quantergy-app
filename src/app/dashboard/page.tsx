import dashboardStats from "@/app/mocks/dashboard.json";
import { StatsCard } from "@/components/common/StatsCard/StatsCard";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Today&apos;s overview — {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}
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
