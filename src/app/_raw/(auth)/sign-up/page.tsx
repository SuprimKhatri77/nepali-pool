import SignUpPage from "@/components/SignUpForm";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../../../lib/db";
import { user } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getStudentProfile } from "../../../../../server/lib/auth/helpers/getStudentProfile";
import { getMentorProfile } from "../../../../../server/lib/auth/helpers/getMentorProfile";

export const metadata = {
  title: "Sign up | Nepali Pool",
};

export default async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <SignUpPage />;
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    return redirect("/sign-up");
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
