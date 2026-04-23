"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/navigation/navItems";
import styles from "./FooterNav.module.css";

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
