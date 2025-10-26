import StudentOnboardingForm from "@/components/StudentOnboardingForm";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { studentProfile, user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { redirectWithMessage } from "../../../../server/lib/auth/helpers/redirect-with-message";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectWithMessage("/login", "Please login to continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    await auth.api.signOut({
      headers: await headers(),
    });
    return redirectWithMessage("/sign-up", "Please signup to continue");
  }

  if (!userRecord.emailVerified) {
    return redirectWithMessage(
      "/verify-email",
      "Please verify your email to continue"
    );
  }

  if (!userRecord.role || userRecord.role === "none") {
    return redirectWithMessage("/select-role", "Please select a valid role");
  }

  if (userRecord.role === "admin") {
    return redirect("/admin/dashboard");
  }

  if (userRecord.role === "mentor") {
    return redirect("/dashboard/mentor");
  }

  const [studentProfileRecord] = await db
    .select()
    .from(studentProfile)
    .where(eq(studentProfile.userId, userRecord.id));

  if (studentProfileRecord) {
    return redirect("/dashboard/student");
  }

  return <StudentOnboardingForm currentUserId={userRecord.id} />;
}
