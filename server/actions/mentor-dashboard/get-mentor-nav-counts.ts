"use server";

import type { ActionResult } from "../../../src/utils/action-result";
import { getCurrentMentor } from "../../lib/auth/guards";
import {
  getMentorAttentionCounts,
  type MentorAttentionCounts,
} from "../../lib/mentor-dashboard/attention-counts";

// Badge counts for the mentor dashboard sidebar.
export async function getMentorNavCounts(): Promise<
  ActionResult<MentorAttentionCounts>
> {
  const current = await getCurrentMentor();
  if (!current.success) return current;

  return {
    success: true,
    data: await getMentorAttentionCounts(current.mentorRecord.userId),
  };
}
