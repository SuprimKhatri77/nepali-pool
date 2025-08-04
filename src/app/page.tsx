import HomePage from "@/components/HomePage";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../server/lib/auth/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Nepali Pool",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userRecord) {
      return notFound();
    }

    if (!userRecord.emailVerified) {
      return redirect(
        `sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`
      );
    }

    if (userRecord.role !== "none" && userRecord.role !== "admin") {
      return redirect(`/dashboard/${userRecord.role}`);
    } else if (userRecord.role === "admin") {
      return redirect("/admin");
    } else {
      return redirect("/select-role");
    }
  }
  return <HomePage />;
}
