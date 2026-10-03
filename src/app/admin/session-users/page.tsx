import { requireAdmin } from "../../../../server/lib/auth/guards";
import SessionUserList from "@/components/admin/session-user-list/session-user-list";
import { db } from "../../../../lib/db";

export default async function Page() {
  await requireAdmin();

  const sessionUsers = await db.query.meetingSession.findMany();

  return <SessionUserList sessionUsers={sessionUsers ?? []} />;
}
