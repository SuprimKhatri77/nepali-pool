import Header from "@/components/orginal-components/PUBLIC/header/page";
import { headers } from "next/headers";
import { auth } from "../../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";

export default async function ServerHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <Header Login={false} />;;
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    return redirect("/sign-up");
  }

  if (!userRecord.emailVerified) {
    return redirect(
      `/sign-up/verify-email?email=${encodeURIComponent(userRecord.email)}`
    );
  }

  if (userRecord.role === "none") {
    return redirect("/select-role");
  }
  const Role = userRecord.role
  
  return <Header Login={true} Role={Role}/>;
}
