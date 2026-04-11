import type { ReactNode } from "react";

import { FooterNav } from "@/components/FooterNav/FooterNav";
import { Header } from "@/components/Header/Header";
import styles from "./ShellLayout.module.css";

export function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>
      <FooterNav />
    </div>
  );
}
