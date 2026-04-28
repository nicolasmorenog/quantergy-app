import { requireAuthPage } from "@/server/auth/guards";

import { HistorySection } from "./HistorySection";

export default async function HistoryPage() {
  await requireAuthPage();

  return <HistorySection />;
}
