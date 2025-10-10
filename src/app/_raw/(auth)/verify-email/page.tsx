import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import VerifyEmail from "@/components/VerifyEmail";
import { auth } from "../../../../../server/lib/auth/auth";
import { db } from "../../../../../lib/db";
import {
  mentorProfile,
  studentProfile,
  user,
} from "../../../../../lib/db/schema";
import { getStudentProfile } from "../../../../../server/lib/auth/helpers/getStudentProfile";
import { getMentorProfile } from "../../../../../server/lib/auth/helpers/getMentorProfile";

interface PageProps {
  searchParams: { email?: string };
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
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
    console.log(
      "Found user with session but not user record: ",
      session.user.id
    );
    await auth.api.signOut({
      headers: await headers(),
    });
    return redirect("/login?error=invalid_session");
  }

  if (!userRecord.emailVerified) {
    return <VerifyEmail email={userRecord.email} />;
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
