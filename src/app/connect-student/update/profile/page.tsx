import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import UpdateStudentCardForm from "@/modules/connect-student/update-student-form";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) redirect("/");
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });
  if (!userRecord) {
    await auth.api.signOut({ headers: await headers() });
    redirect("/");
  }
  if (userRecord.role !== "student") redirect("/");

  const connectStudentProfile = await db.query.connectStudentProfiles.findFirst(
    {
      where: (fields, { eq }) => eq(fields.userId, userRecord.id),
    },
  );
  if (!connectStudentProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-black">
          You dont have a student card yet.
        </h1>
        <Button asChild variant="outline">
          <Link href="/connect-student">Make one</Link>
        </Button>
      </div>
    );
  }
  return <UpdateStudentCardForm student={connectStudentProfile}/>
}
