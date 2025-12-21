import { db } from "../../../../lib/db";
import {
  chats,
  mentorProfile,
  studentProfile,
} from "../../../../lib/db/schema";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import Message from "@/components/Message";
import { requireUser } from "../../../../server/lib/auth/helpers/requireUser";

type ParamsType = {
  params: Promise<{ chatId: string }>;
};

function isUUID(id: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === "string" && uuidRegex.test(id);
}

const page = async ({ params }: ParamsType) => {
  const { chatId } = await params;

  if (!chatId || !isUUID(chatId)) {
    return notFound();
  }

  const userRecord = await requireUser();

  const chatRecord = await db.query.chats.findFirst({
    where: (fields, { eq }) => and(eq(chats.id, chatId)),
    with: {
      studentProfile: { with: { user: true } },
      mentorProfile: { with: { user: true } },
    },
  });

  if (!chatRecord) {
    return notFound();
  }

  const isStudent = chatRecord.studentId === userRecord.id;
  const isMentor = chatRecord.mentorId === userRecord.id;

  if (!isStudent && !isMentor) {
    console.warn(
      `Unauthorized access attempt: User ${userRecord.id} tried to access chat ${chatId}`
    );
    return notFound();
  }

  if (userRecord.role === "student") {
    const [studentRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));

    if (!studentRecord)
      return redirect(
        "/onboarding/student?message=Please+complete+the+onboarding+to+continue!"
      );

    if (chatRecord.studentId !== userRecord.id) {
      console.warn(
        `Student ${userRecord.id} tried to access chat ${chatId} they're not part of`
      );
      return notFound();
    }

    return (
      <Message
        role="student"
        chatId={chatId}
        currentUser={userRecord}
        chatRecord={chatRecord}
      />
    );
  }

  if (userRecord.role === "mentor") {
    const [mentorRecord] = await db
      .select()
      .from(mentorProfile)
      .where(eq(mentorProfile.userId, userRecord.id));

    if (!mentorRecord)
      return redirect(
        "/onboarding/mentor?message=Please+complete+the+onboarding+to+continue!"
      );
    if (mentorRecord.verifiedStatus === "pending") return redirect("/waitlist");
    if (mentorRecord.verifiedStatus === "rejected")
      return redirect("/rejected");

    if (chatRecord.mentorId !== userRecord.id) {
      console.warn(
        `Mentor ${userRecord.id} tried to access chat ${chatId} they're not part of`
      );
      return notFound();
    }

    return (
      <Message
        role="mentor"
        chatId={chatId}
        currentUser={userRecord}
        chatRecord={chatRecord}
      />
    );
  }

  return redirect("/select-role");
};

export default page;
