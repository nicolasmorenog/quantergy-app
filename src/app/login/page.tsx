import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/server/auth/session";
import styles from "./page.module.css";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.page}>
      <LoginForm className={styles.form} />
    </div>
  );
}
