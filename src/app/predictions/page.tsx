import { requireAuthPage } from "@/server/auth/guards";

import { PredictionsSection } from "./PredictionsSection";

export default async function PredictionsPage() {
  await requireAuthPage();

  return <PredictionsSection />;
}
