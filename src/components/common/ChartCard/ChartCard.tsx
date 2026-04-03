import { Card, CardContent } from "@/components/ui/card";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
  title: string;
  children?: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardContent className={styles.content}>
        <p className={styles.title}>{title}</p>
        {children ?? (
          <div className={styles.placeholder}>
            <p className={styles.placeholderText}>Chart coming soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
