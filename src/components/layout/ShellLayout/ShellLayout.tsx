"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { FooterNav } from "@/components/FooterNav/FooterNav";
import { Header } from "@/components/Header/Header";
import styles from "./ShellLayout.module.css";

export function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main} data-no-footer={isLoginRoute}>
        {children}
      </main>
      {!isLoginRoute && <FooterNav />}
    </div>
  );
}
