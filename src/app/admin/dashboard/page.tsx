import { headers } from "next/headers";
import { auth } from "../../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import AdminPage from "@/components/AdminPage";

export const metadata = {
  title: "Admin | Nepali Pool",
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return redirect("/sign-up");
  }

  if (!userRecord.emailVerified) {
    return redirect(`/verify-email`);
  }

  if (userRecord.role === "none") {
    return redirect("/select-role");
  }

  if (userRecord.role === "student") {
    return redirect("/dashboard/student");
  }
  if (userRecord.role === "mentor") {
    return redirect("/dashboard/mentor");
  }

  return <AdminPage />;
}
