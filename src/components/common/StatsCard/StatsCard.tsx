import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export function StatsCard({ label, value, delta, deltaPositive }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className={styles.label}>{label}</p>
            <p className={styles.value}>{value}</p>
            {delta && (
              <div className={cn(
                styles.delta,
                deltaPositive ? styles.deltaPositive : styles.deltaNegative
              )}>
                {deltaPositive ? (
                  <TrendingUp className={styles.deltaIcon} />
                ) : (
                  <TrendingDown className={styles.deltaIcon} />
                )}
                {delta}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
