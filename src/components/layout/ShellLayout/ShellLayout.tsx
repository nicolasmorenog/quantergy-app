import { Header } from "@/components/Header/Header";
import styles from "./ShellLayout.module.css";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
