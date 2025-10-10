import { LoginForm } from "@/components/login-form";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../../../lib/db";
import {
  mentorProfile,
  studentProfile,
  user,
} from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getStudentProfile } from "../../../../../server/lib/auth/helpers/getStudentProfile";
import { getMentorProfile } from "../../../../../server/lib/auth/helpers/getMentorProfile";

export const metadata = {
  title: "Login | Nepali Pool",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    );
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user?.id));

  if (!userRecord) {
    await auth.api.signOut({
      headers: await headers(),
    });
    return redirect("/login?error=invalid_session");
  }

  if (!userRecord.emailVerified) {
    return redirect("/verify-email");
  }

  if (!userRecord.role || userRecord.role === "none") {
    return redirect("/select-role");
  }

  if (userRecord.role === "admin") {
    return redirect("/admin/dashboard");
  }

  if (userRecord.role === "student") {
    await getStudentProfile(userRecord.id);
  }

  if (userRecord.role === "mentor") {
    await getMentorProfile(userRecord.id);
  }

  return notFound();
}
