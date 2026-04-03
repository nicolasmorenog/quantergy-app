"use client";

import Image from "next/image";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ isSidebarOpen = false, onToggleSidebar }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.sidebarButton}
        type="button"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-disabled={!onToggleSidebar}
        disabled={!onToggleSidebar}
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <PanelLeftClose className={styles.sidebarButtonIcon} /> : <PanelLeft className={styles.sidebarButtonIcon} />}
      </button>
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
    </header>
  );
}
