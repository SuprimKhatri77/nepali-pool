export const runtime = "nodejs";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "../../../lib/db";
import { rateLimit } from "../../../lib/db/schema";

const windowSeconds = 86400;
const maxRequests = 3;

export async function checkAndUpdateRateLimit(
  key: string,
  providedIp?: string
) {
  let ip = providedIp;

  if (!ip) {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const cfConnectingIp = headersList.get("cf-connecting-ip");
    const realIp = headersList.get("x-real-ip");

    ip =
      forwardedFor?.split(",")[0].trim() ||
      cfConnectingIp ||
      realIp ||
      "unknown";

    if (ip.includes("::ffff:127.0.0.1") || ip === "::1") {
      ip = "127.0.0.1";
    }

    console.log("IP detected from check and update ratelimit function:", ip);
  }

  const rateLimitKey = `${key}:${ip}`;
  const now = Date.now();

  return await db.transaction(async (tx) => {
    const rateLimitRecord = await tx
      .select()
      .from(rateLimit)
      .where(eq(rateLimit.key, rateLimitKey))
      .for("update")
      .limit(1);

    if (rateLimitRecord.length === 0) {
      await tx.insert(rateLimit).values({
        key: rateLimitKey,
        count: 1,
        lastRequest: now,
      });
      return { allowed: true };
    }

    const record = rateLimitRecord[0];
    const elapsed = (now - (record.lastRequest ?? 0)) / 1000;

    if (elapsed > windowSeconds) {
      await tx
        .update(rateLimit)
        .set({ count: 1, lastRequest: now })
        .where(eq(rateLimit.key, rateLimitKey));
      return { allowed: true };
    }

    if ((record.count ?? 0) >= maxRequests) {
      return { allowed: false };
    }

    await tx
      .update(rateLimit)
      .set({ count: (record.count ?? 0) + 1, lastRequest: now })
      .where(eq(rateLimit.key, rateLimitKey));

    return { allowed: true };
  });
}
