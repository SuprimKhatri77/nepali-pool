import { randomInt } from "node:crypto";

// No 0/O/1/I so codes are easy to read out over the phone.
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// e.g. generateReferenceCode("NPB") -> "NPB-7KQ2M9XD"
export function generateReferenceCode(prefix: string) {
  let code = `${prefix}-`;
  for (let i = 0; i < 8; i++)
    code += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return code;
}

// Loose on purpose (the column is varchar(20)): callers still look the code
// up against the owner, this only keeps junk from a URL out of the query.
const REFERENCE_CODE_RE = /^[A-Z0-9-]{1,20}$/;

export function isReferenceCode(value: unknown): value is string {
  return typeof value === "string" && REFERENCE_CODE_RE.test(value);
}
