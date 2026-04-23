"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/navigation/navItems";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [observedSection, setObservedSection] = useState("dashboard");
  const routeActiveSection =
    NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.sectionId ?? "dashboard";
  const activeSection =
    isDesktop && pathname === "/dashboard" ? observedSection : routeActiveSection;

  useEffect(() => {
    if (!isDesktop || pathname !== "/dashboard") {
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-section]"),
    );

    if (sections.length === 0) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const hashSection = window.location.hash.replace("#", "");

      if (hashSection) {
        setObservedSection(hashSection);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const mostVisibleSection = visibleEntries[0]?.target.id;

        if (mostVisibleSection) {
          setObservedSection(mostVisibleSection);
        }
      },
      {
        rootMargin: "-25% 0px -50% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [isDesktop, pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <Image
            src="/flyquest-logo.svg"
            alt="Quantergy logo"
            width={24}
            height={24}
            className={styles.logoImage}
            priority
          />
        </div>
        <span className={styles.logo}>Quantergy</span>
      </div>

      <nav className={styles.desktopNav} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const href = item.desktopHref;
          const isActive =
            pathname === "/dashboard" && item.sectionId
              ? activeSection === item.sectionId
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={href}
              className={styles.desktopNavLink}
              data-active={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
