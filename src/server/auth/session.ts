import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import type { PublicAuthUser } from "@/lib/auth/types";

export const SESSION_COOKIE_NAME = "quantergy_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = PublicAuthUser & {
  expiresAt: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "quantergy-demo-auth-secret";
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function signaturesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function createSessionToken(user: PublicAuthUser) {
  const payload: SessionPayload = {
    ...user,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;

    if (
      typeof payload.id !== "number" ||
      typeof payload.email !== "string" ||
      !(payload.role === "ADMIN" || payload.role === "CLIENT") ||
      !(typeof payload.clientId === "number" || payload.clientId === null) ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      clientId: payload.clientId,
    } satisfies PublicAuthUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
