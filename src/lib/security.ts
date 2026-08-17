import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function getKey() {
  const raw = process.env.CONTACT_ENCRYPTION_KEY;
  if (!raw) throw new Error("CONTACT_ENCRYPTION_KEY is not configured");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("CONTACT_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return key;
}

export function encryptSensitive(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

export function decryptSensitive(value: string | null | undefined) {
  if (value == null || !value.startsWith("v1:")) return value ?? null;
  const [, ivRaw, tagRaw, dataRaw] = value.split(":");
  try {
    const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivRaw, "base64url"));
    decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(dataRaw, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return "[encrypted data unavailable]";
  }
}

export function hashRateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] as string);
}
