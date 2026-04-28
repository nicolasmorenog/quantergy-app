"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { FooterNav } from "@/components/FooterNav/FooterNav";
import { Header } from "@/components/Header/Header";
import type { PublicAuthUser } from "@/lib/auth/types";
import styles from "./ShellLayout.module.css";

export function ShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";
  const [user, setUser] = useState<PublicAuthUser | null>(null);

  useEffect(() => {
    let isActive = true;

    if (isLoginRoute) {
      return;
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { user: PublicAuthUser | null }) => {
        if (isActive) {
          setUser(payload.user);
        }
      })
      .catch(() => {
        if (isActive) {
          setUser(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isLoginRoute, pathname]);

  return (
    <div className={styles.shell}>
      <Header user={user} />
      <main className={styles.main} data-no-footer={isLoginRoute}>
        {children}
      </main>
      {!isLoginRoute && <FooterNav user={user} />}
    </div>
  );
}
