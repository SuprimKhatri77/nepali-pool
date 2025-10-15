import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";
import { redirectByRole } from "../../../server/helper/redirectByrole";
import NotFound from "../not-found";

export default async function Dashboard() {
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

  await redirectByRole(userRecord);

  return <NotFound />;
}
