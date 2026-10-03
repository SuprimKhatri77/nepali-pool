import { db } from "../../../../lib/db";
import { chats } from "../../../../lib/db/schema";
import { notFound } from "next/navigation";
import Message from "@/components/Message";
import { requireViewer } from "../../../../server/lib/auth/guards";

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

  const viewer = await requireViewer(["student", "mentor"]);
  const userRecord = viewer.user;

  const chatRecord = await db.query.chats.findFirst({
    where: (fields, { eq }) => eq(chats.id, chatId),
    with: {
      studentProfile: { with: { user: true } },
      mentorProfile: { with: { user: true } },
    },
  });

  if (!chatRecord) {
    return notFound();
  }

  const isParticipant =
    viewer.status === "student"
      ? chatRecord.studentId === userRecord.id
      : chatRecord.mentorId === userRecord.id;
  if (!isParticipant) {
    console.warn(
      `Unauthorized access attempt: User ${userRecord.id} tried to access chat ${chatId}`
    );
    return notFound();
  }

  return (
    <Message
      role={viewer.status}
      chatId={chatId}
      currentUser={userRecord}
      chatRecord={chatRecord}
    />
  );
};

export default page;
