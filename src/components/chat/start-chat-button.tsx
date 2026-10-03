"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getOrCreateChat } from "../../../server/lib/auth/helpers/free/get-or-create-chat";

// Opens (creating on first use) the student's chat with a mentor. The chat row
// is only created when the student actually clicks, never on page view.
export function StartChatButton({
  mentorId,
  className,
}: {
  mentorId: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      const result = await getOrCreateChat(mentorId);
      if (!result.success) {
        toast.error("Unable to start chat. Please try again.");
        return;
      }
      router.push(`/chats/${result.chatId}`);
    } catch {
      toast.error("Unable to start chat. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isPending} className={className}>
      {isPending ? (
        <Spinner />
      ) : (
        <MessageCircleIcon className="w-5 h-5 mr-2 text-emerald-600" />
      )}
      Chat
    </Button>
  );
}
