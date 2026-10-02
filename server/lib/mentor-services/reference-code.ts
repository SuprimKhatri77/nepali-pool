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
