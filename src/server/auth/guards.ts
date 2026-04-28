import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth/session";

export async function requireAuthPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminPage() {
  const user = await requireAuthPage();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
