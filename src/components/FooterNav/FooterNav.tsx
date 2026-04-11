"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, LayoutDashboard, LineChart, Upload } from "lucide-react";

import styles from "./FooterNav.module.css";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/predictions",
    label: "Predictions",
    icon: LineChart,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/upload",
    label: "Upload",
    icon: Upload,
  },
] as const;

export function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer} aria-label="Main navigation">
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              data-active={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
