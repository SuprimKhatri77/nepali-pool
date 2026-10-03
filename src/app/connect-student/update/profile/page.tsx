import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getViewer } from "../../../../../server/lib/auth/viewer";
import UpdateStudentCardForm from "@/modules/connect-student/update-student-form";

export default async function Page() {
  // Student cards don't need a verified email or a finished student
  // onboarding, only a student account.
  const viewer = await getViewer();
  const userRecord = "user" in viewer ? viewer.user : null;
  if (!userRecord || userRecord.role !== "student") redirect("/");

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
