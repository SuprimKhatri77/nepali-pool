import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getStudentProfile } from "../../../../server/lib/auth/helpers/getStudentProfile";
import { getMentorProfile } from "../../../../server/lib/auth/helpers/getMentorProfile";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";

export const metadata = {
  title: "Sign up | Nepali Pool",
};

export default async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="grid min-h-svh grid-cols-1">
        <div className="flex flex-col gap-4 py-4 px-2 sm:px-6 md:px-10 bg-gray-100">
          <div className="flex justify-between gap-2 md:justify-between md:items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                <Link href={"/"}>NP</Link>
              </div>
              <span className="font-semibold text-lg text-gray-900">
                NepaliPool
              </span>
            </div>
            <Link
              href="/"
              className="sm:hidden block group px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors "
            >
              <ArrowLeft className="group-hover:-translate-x-1.5 group-hover:text-emerald-900 transition-all duration-300" />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl px-4 sm:px-12 py-8 shadow-md bg-white rounded-[6px]">
              <SignupForm />
            </div>
          </div>
        </div>


      </div>
    );
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
