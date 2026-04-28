import { scryptSync, timingSafeEqual } from "node:crypto";

export function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, salt, storedHash] = passwordHash.split("$");

  if (algorithm !== "scrypt" || !salt || !storedHash) {
    return false;
  }

  const storedBuffer = Buffer.from(storedHash, "hex");
  const candidateBuffer = scryptSync(password, salt, storedBuffer.length);

  return timingSafeEqual(storedBuffer, candidateBuffer);
}
