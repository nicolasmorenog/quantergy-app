import { requireAdminPage } from "@/server/auth/guards";

import { UploadView } from "./UploadView";

export default async function UploadPage() {
  await requireAdminPage();

  return <UploadView />;
}
