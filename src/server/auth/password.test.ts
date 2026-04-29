import { scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";

import { verifyPassword } from "./password";

function createPasswordHash(password: string) {
  const salt = "test-salt";
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

describe("verifyPassword", () => {
  it("accepts a matching password", () => {
    const passwordHash = createPasswordHash("admin123");

    expect(verifyPassword("admin123", passwordHash)).toBe(true);
  });

  it("rejects a wrong password", () => {
    const passwordHash = createPasswordHash("admin123");

    expect(verifyPassword("wrong-password", passwordHash)).toBe(false);
  });

  it("rejects malformed hashes", () => {
    expect(verifyPassword("admin123", "bad-hash")).toBe(false);
  });
});
