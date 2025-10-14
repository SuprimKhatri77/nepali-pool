"use server";

import { startOfWeek, subWeeks } from "date-fns";
import { db } from "../../lib/db";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { chatSubscription } from "../../lib/db/schema";

export async function getChatIncreaseCount(mentorId: string) {
  // Get the current date/time as reference point
  const now = new Date();

  // -------------------- WEEK CALCULATIONS --------------------

  // Calculate the start of THIS week (Monday) based on `now`
  // weekStartsOn: 1 → Monday is considered the first day of the week
  // Example: If today is Friday, Oct 17, 2025 → startOfThisWeek = Monday, Oct 13, 2025 00:00
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });

  // Calculate the start of LAST week by subtracting 1 week from startOfThisWeek
  // Example: startOfThisWeek = Oct 13 → startOfLastWeek = Monday, Oct 6, 2025 00:00
  const startOfLastWeek = subWeeks(startOfThisWeek, 1);

  // End of last week is the start of this week
  // Using `lt(endOfLastWeek)` ensures last week counts up to Sunday 23:59, excluding Monday
  const endOfLastWeek = startOfThisWeek;

  // -------------------- TIMELINE VISUAL --------------------
  // Last Week        This Week
  // Mon 6 Oct ──────────────── Mon 13 Oct ────────────── Fri 17 Oct(now)
  // gte(startOfLastWeek)       gte(startOfThisWeek)
  // lt(endOfLastWeek)          (counts up to now)

  // This shows clearly how `gte` and `lt` slice the data for each week

  // -------------------- THIS WEEK --------------------
  // Count chats created from Monday this week up to now
  const [{ count: thisWeekCount }] = await db
    .select({ count: count() })
    .from(chatSubscription)
    .where(
      and(
        eq(chatSubscription.mentorId, mentorId),
        gte(chatSubscription.createdAt, startOfThisWeek)
      )
    );

  // -------------------- LAST WEEK --------------------
  // Count chats created from Monday last week up to Sunday last week
  const [{ count: lastWeekCount }] = await db
    .select({ count: count() })
    .from(chatSubscription)
    .where(
      and(
        eq(chatSubscription.mentorId, mentorId),
        gte(chatSubscription.createdAt, startOfLastWeek),
        lt(chatSubscription.createdAt, endOfLastWeek)
      )
    );

  // -------------------- RESULT --------------------
  // thisWeekCount → number of chats created this week (Monday → now)
  // lastWeekCount → number of chats created last week (Monday → Sunday)
  // Calculate increase safely, clamping negative to 0:
  // const increase = Math.max(0, thisWeekCount - lastWeekCount);
  const increase = thisWeekCount - lastWeekCount;

  return increase > 0 ? increase : 0;
}
