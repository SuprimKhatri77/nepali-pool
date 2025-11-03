import { headers } from "next/headers";
import { auth } from "../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?message=Please+login+to+continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    redirect("/login?message=Please+login+to+continue");
  }

  if (!userRecord.emailVerified) {
    redirect(`/verify-email`);
  }

  if (userRecord.role === "none" || !userRecord.role) {
    redirect("/select-role");
  }

  if (userRecord.role !== "admin") redirect("/dashboard");

  redirect("admin/dashboard");
}
