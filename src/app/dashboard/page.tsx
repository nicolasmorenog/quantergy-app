import { ChartCard } from "@/components/common/ChartCard/ChartCard";
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
        <StatsCard
          label="Today's Prediction"
          value="142.3 MWh"
          delta="+4.2% vs yesterday"
          deltaPositive
        />
        <StatsCard
          label="Real Value"
          value="138.7 MWh"
          delta="-2.5% vs prediction"
          deltaPositive={false}
        />
        <StatsCard
          label="Market Price"
          value="€87.40 /MWh"
          delta="+1.8% vs yesterday"
          deltaPositive
        />
        <StatsCard
          label="Forecast Accuracy"
          value="97.4%"
          delta="+0.3% vs last week"
          deltaPositive
        />
      </div>

      <ChartCard title="Prediction vs Real — Last 7 days" />
    </div>
  );
}
