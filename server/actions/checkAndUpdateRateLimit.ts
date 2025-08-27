"use server";

import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { rateLimit } from "../../lib/db/schema";

const windowSeconds = 86400;
const maxRequests = 3;

export async function checkAndUpdateRateLimit(key: string) {
  const now = Date.now();

  const rateLimitRecord = await db
    .select()
    .from(rateLimit)
    .where(eq(rateLimit.key, key))
    .limit(1);

  if (rateLimitRecord.length === 0) {
    await db.insert(rateLimit).values({
      id: key,
      key,
      count: 1,
      lastRequest: now,
    });
    return true;
  }

  const record = rateLimitRecord[0];
  const lastRequest = record.lastRequest ?? 0;
  const count = record.count ?? 0;

  const elapsed = (now - lastRequest) / 1000;

  if (elapsed > windowSeconds) {
    await db
      .update(rateLimit)
      .set({ count: 1, lastRequest: now })
      .where(eq(rateLimit.key, key));
    return true;
  }

  if (count >= maxRequests) {
    return false;
  }

  await db
    .update(rateLimit)
    .set({ count: count + 1, lastRequest: now })
    .where(eq(rateLimit.key, key));

  return true;
}
