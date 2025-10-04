"use client";

import { useEffect, useState } from "react";
import { getMessages } from "../../server/helper/getMessages";
import {
  ChatsSelectType,
  MentorProfileSelectType,
  MessageSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../lib/db/schema";
import Image from "next/image";
import { Input } from "./ui/input";
import { sendMessage } from "../../server/actions/send-message/sendMessage";
import { toast } from "sonner";
import { createClient } from "../../server/utlis/supabase/client";
import Loader from "./Loader";

type Props = {
  role: "student" | "mentor";
  chatId: string;
  currentUser: UserSelectType;
  chatRecord: ChatsSelectType & {
    studentProfile: StudentProfileSelectType & {
      user: UserSelectType;
    };
    mentorProfile: MentorProfileSelectType & {
      user: UserSelectType;
    };
  };
};

type MessagesWithUser = MessageSelectType & {
  chats:
    | (ChatsSelectType & {
        studentProfile: StudentProfileSelectType & {
          user: UserSelectType;
        };
        mentorProfile: MentorProfileSelectType & {
          user: UserSelectType;
        };
      })
    | null;
};

const Message = ({ role, chatId, currentUser, chatRecord }: Props) => {
  const [messages, setMessages] = useState<MessagesWithUser[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

  let otherUser = null;
  if (chatRecord.studentId === currentUser.id) {
    otherUser = chatRecord.mentorProfile;
  } else if (chatRecord.mentorId === currentUser.id) {
    otherUser = chatRecord.studentProfile;
  } else {
    console.warn("Current user is neither student nor mentor in this chat");
    otherUser = null;
  }

  useEffect(() => {
    async function fetchMessages() {
      setLoadingMessage(true);
      try {
        const result = await getMessages(chatId);
        if (result) {
          console.log("📥 Fetched messages:", result.length);
          setMessages(result);
        }
      } catch (error) {
        console.error("Error fetching messages: ", error);
        toast.error("Error fetching message.");
      } finally {
        setLoadingMessage(false);
      }
    }
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const supabase = createClient();

    console.log("📡 Setting up subscription for chat:", chatRecord.id);

    const channel = supabase
      .channel(`chat-${chatRecord.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatRecord.id}`,
        },
        (payload) => {
          console.log("🔔 New message received:", payload);

          const rawData = payload.new as any;

          const newMessageData: MessageSelectType = {
            id: rawData.id,
            senderId: rawData.sender_id,
            chatId: rawData.chat_id,
            message: rawData.message,
            attachmentUrl: rawData.attachment_url,
            createdAt: rawData.created_at,
            isEdited: rawData.is_edited,
            deletedAt: rawData.deleted_at,
            updatedAt: rawData.updated_at,
          };

          const newMessage: MessagesWithUser = {
            ...newMessageData,
            chats: {
              ...chatRecord,
              studentProfile: chatRecord.studentProfile,
              mentorProfile: chatRecord.mentorProfile,
            },
          };

          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.id === newMessage.id
            );

            if (messageExists) {
              console.log("⚠️ Message already exists, skipping");
              return prevMessages;
            }

            const updated = [...prevMessages, newMessage];
            console.log("📝 Updated messages count:", updated.length);
            return updated;
          });
        }
      )
      .subscribe((status, err) => {
        console.log("🔗 Subscription status:", status);
        if (err) {
          console.error("❌ Subscription error:", err);
        }

        switch (status) {
          case "SUBSCRIBED":
            console.log(
              "✅ Successfully subscribed to real-time updates for chat:",
              chatRecord.id
            );
            break;
          case "CHANNEL_ERROR":
            console.error(
              "❌ Channel subscription error for chat:",
              chatRecord.id
            );
            break;
          case "TIMED_OUT":
            console.error("⏰ Subscription timed out for chat:", chatRecord.id);
            break;
          case "CLOSED":
            console.log("🔒 Subscription closed for chat:", chatRecord.id);
            break;
        }
      });

    return () => {
      console.log("🧹 Cleaning up channel for chat:", chatRecord.id);
      supabase.removeChannel(channel);
    };
  }, [chatRecord.id]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setPending(true);

    const message = messageText;
    const senderId = currentUser.id;
    const chatId = chatRecord.id;

    try {
      const result = await sendMessage(message, senderId, chatId);
      if (result) {
        setMessageText("");
      } else {
        console.error("Failed to send message");
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Error sending message");
    } finally {
      setPending(false);
    }
  };

  console.log("📊 Current messages count:", messages.length);

  return (
    <div className="min-h-screen w-full bg-slate-50 rounded-xl py-5 px-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 relative rounded-full">
          {otherUser?.imageUrl ? (
            <Image
              src={otherUser.imageUrl!}
              alt="Profile Picture"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <Image
              src="https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
              alt="Profile Picture"
              fill
              className="rounded-full object-cover"
            />
          )}
        </div>
        <p className="text-xl font-medium capitalize">
          {otherUser?.user?.name || ""}
        </p>
      </div>
      <hr />

      <div
        className={`flex flex-1 flex-col ${loadingMessage ? "items-center justify-center" : "justify-end"} overflow-y-auto`}
      >
        {loadingMessage ? (
          <Loader />
        ) : messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-gray-500">
              This is the start of your conversation with{" "}
              {otherUser ? otherUser.user.name : "Unknown"}
            </h1>
          </div>
        )}
      </div>

      <div className="flex justify-end relative">
        <Input
          className="rounded-full border-gray-400"
          type="text"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          onKeyDown={(e) => e.key === "Enter" && !pending && handleSend()}
          disabled={pending}
          placeholder="Type a message..."
        />
        <div className="absolute top-2 right-4">
          <button
            className="bg-transparent text-black hover:bg-transparent cursor-pointer hover:scale-105 duration-300 transition-all disabled:opacity-50"
            onClick={handleSend}
            disabled={pending || !messageText.trim()}
          >
            {pending ? (
              <div className="inline-block border-green-400 h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                <path d="M6.5 12h14.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
