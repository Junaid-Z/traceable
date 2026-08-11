import { randomBytes } from "node:crypto";

export function generateRandomPublicId() {
  // 6 bits each character makes 6 bytes (6x8 bits)
  // for 8 characters
  return randomBytes(6).toString("base64url");
}
