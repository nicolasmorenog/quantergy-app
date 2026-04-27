"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import styles from "./ClientTabs.module.css";

type ClientTabOption = {
  label?: string;
  value: string;
};

type ClientTabsProps = {
  ariaLabel?: string;
  clients: ClientTabOption[];
  onValueChange: (value: string) => void;
  value: string;
};

export function ClientTabs({
  ariaLabel = "Client",
  clients,
  onValueChange,
  value,
}: ClientTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={styles.clientTabs}
    >
      <TabsList aria-label={ariaLabel} className={styles.clientTabsList}>
        {clients.map((client) => (
          <TabsTrigger
            key={client.value}
            value={client.value}
            className={styles.clientTabTrigger}
          >
            {client.label ?? client.value}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
