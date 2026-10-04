import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "../../../../lib/db";
import { chats } from "../../../../lib/db/schema";
import { ChatThread } from "@/components/chat/chat-thread";
import { requireViewer } from "../../../../server/lib/auth/guards";
import { participantColumns } from "../../../../server/lib/chats/participant-columns";

export const metadata = {
  title: "Messages | NepaliPool",
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const viewer = await requireViewer(["student", "mentor"]);
  const { chatId } = await params;
  // Not uuid-shaped: Postgres would reject the comparison.
  if (!z.guid().safeParse(chatId).success) notFound();

  const chat = await db.query.chats.findFirst({
    where: (fields, { eq }) => eq(chats.id, chatId),
    // Each side only gets the other's name and photo.
    with: {
      studentProfile: participantColumns,
      mentorProfile: participantColumns,
    },
  });
  // Someone else's chat looks exactly like a missing one.
  const isStudent = viewer.status === "student";
  if (
    !chat ||
    (isStudent ? chat.studentId : chat.mentorId) !== viewer.user.id
  ) {
    notFound();
  }

  const other = isStudent ? chat.mentorProfile : chat.studentProfile;

  return (
    <ChatThread
      // Fresh thread state (scroll position, composer) per chat.
      key={chat.id}
      chatId={chat.id}
      role={viewer.status}
      viewer={{ id: viewer.user.id, email: viewer.user.email }}
      active={chat.status === "active"}
      mentorId={chat.mentorId}
      other={{ name: other.user.name, imageUrl: other.imageUrl }}
    />
  );
}
