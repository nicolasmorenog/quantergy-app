import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(null, { status: 204 });
}
