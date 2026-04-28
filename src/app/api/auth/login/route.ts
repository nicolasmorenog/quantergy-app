import { cookies } from "next/headers";

import { prisma } from "@/server/db/client";
import { verifyPassword } from "@/server/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return Response.json(
      { error: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  const email = body.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    return Response.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    clientId: user.clientId,
  };
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    createSessionToken(sessionUser),
    getSessionCookieOptions(),
  );

  return Response.json({
    user: sessionUser,
  });
}
