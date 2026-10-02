import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { studentProfile } from "../../../../lib/db/schema";
import { requireUser } from "./requireUser";

// Page guard: only onboarded students get through.
export async function requireStudent() {
  const userRecord = await requireUser();
  if (userRecord.role === "admin") return redirect("/admin");
  if (userRecord.role !== "student") {
    return redirect(`/dashboard/${userRecord.role}`);
  }

  const studentRecord = await db.query.studentProfile.findFirst({
    where: eq(studentProfile.userId, userRecord.id),
  });
  if (!studentRecord) {
    return redirect(
      "/onboarding/student?message=Please+complete+the+onboarding+to+continue!",
    );
  }

  return { userRecord, studentRecord };
}
