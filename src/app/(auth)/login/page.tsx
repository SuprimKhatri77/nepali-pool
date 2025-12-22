import { LoginForm } from "@/components/login-form";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getStudentProfile } from "../../../../server/lib/auth/helpers/getStudentProfile";
import { getMentorProfile } from "../../../../server/lib/auth/helpers/getMentorProfile";
import Link from "next/link";
import NotFound from "@/app/not-found";
import Image from "next/image";
import BackButton from "@/components/landing/resuable/BackButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NepaliPool",
  description:
    "Login to NepaliPool to connect with mentors and get guidance for studying abroad.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      {
        url: "/logoBgWhite.jpg",
        href: "/logoBgWhite.jpg",
      },
    ],
  },
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-between gap-2 md:justify-between md:items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200">
                <Image
                  src={"/logoTransparent.png"}
                  alt="NepaliPool Transparent Logo"
                  width={150}
                  height={70}
                />
              </div>
              <span className="font-semibold text-lg sm:text-xl text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                NepaliPool
              </span>
            </Link>
            <BackButton />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[400px] mx-auto">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:flex  items-center justify-center">
          <div className="  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200">
            <Image
              src={"/logoTransparent.png"}
              alt="NepaliPool Transparent Logo"
              width={150}
              height={70}
            />
          </div>
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
    return redirect("/login?error=login+expired");
  }

  if (!userRecord.emailVerified) {
    return redirect("/verify-email?message=Please+verify+your+email");
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

  return <NotFound />;
}
