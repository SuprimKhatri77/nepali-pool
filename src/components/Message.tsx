"use client";

import { useEffect, useState } from "react";
import { getMessages } from "../../server/helper/getMessages";
import {
  ChatsSelectType,
  MentorProfileSelectType,
  MessageAttachmentsSelectType,
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
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { ImageIcon, X } from "lucide-react";
import { sendAttachments } from "../../server/actions/send-attachments/sendAttachments";
import { getFileType } from "../../server/helper/getFileType";

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
  messageAttachments: MessageAttachmentsSelectType[];
};

const Message = ({ role, chatId, currentUser, chatRecord }: Props) => {
  const [messages, setMessages] = useState<MessagesWithUser[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; name: string; type: string }[]
  >([]);

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
          console.log("Fetched messages:", result.length);
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

    console.log("Setting up subscription for chat:", chatRecord.id);

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
          console.log("New message received:", payload);

          const rawData = payload.new as any;

          const newMessageData: MessageSelectType = {
            id: rawData.id,
            senderId: rawData.sender_id,
            chatId: rawData.chat_id,
            message: rawData.message,
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
            messageAttachments: [],
          };

          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.id === newMessage.id
            );

            if (messageExists) {
              console.log("Message already exists, skipping");
              return prevMessages;
            }

            const updated = [...prevMessages, newMessage];
            console.log("Updated messages count:", updated.length);
            return updated;
          });
        }
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status);
        if (err) {
          console.error("Subscription error:", err);
        }

        switch (status) {
          case "SUBSCRIBED":
            console.log(
              "Successfully subscribed to real-time updates for chat:",
              chatRecord.id
            );
            break;
          case "CHANNEL_ERROR":
            console.error(
              "Channel subscription error for chat:",
              chatRecord.id
            );
            break;
          case "TIMED_OUT":
            console.error("Subscription timed out for chat:", chatRecord.id);
            break;
          case "CLOSED":
            console.log("Subscription closed for chat:", chatRecord.id);
            break;
        }
      });

    return () => {
      console.log("Cleaning up channel for chat:", chatRecord.id);
      supabase.removeChannel(channel);
    };
  }, [chatRecord.id]);

  const handleSend = async () => {
    if (!messageText.trim() && uploadedFiles.length === 0) return;
    setPending(true);

    const message = messageText;
    const senderId = currentUser.id;
    const chatId = chatRecord.id;

    try {
      const messageId = await sendMessage(message, senderId, chatId);
      if (typeof messageId === "string") {
        if (uploadedFiles.length > 0) {
          await sendAttachments(messageId, uploadedFiles);
        }
        setMessageText("");
        setUploadedFiles([]);
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

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  console.log("Current messages count:", messages.length);
  console.log("Uploaded files:", uploadedFiles);

  return (
    <div className="min-h-screen w-full bg-slate-50 rounded-xl py-3 sm:py-5 px-2 sm:px-4 flex flex-col gap-3 sm:gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="h-8 w-8 sm:h-10 sm:w-10 relative rounded-full flex-shrink-0">
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
        <p className="text-base sm:text-xl font-medium capitalize truncate">
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
            const hasText = Boolean(message.message?.trim());

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`px-3 sm:px-4 py-2 rounded-lg max-w-[75%] sm:max-w-xs break-words ${
                    hasText
                      ? isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-300 text-black rounded-bl-none"
                      : "bg-transparent p-0 shadow-none"
                  }`}
                >
                  {message.message && <p className="">{message.message}</p>}

                  {message.messageAttachments?.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-2 ">
                      {message.messageAttachments.map((file: any) =>
                        file.type === "image" ? (
                          <Image
                            key={file.url}
                            src={file.url}
                            alt="attachment"
                            width={100}
                            height={100}
                            className="rounded-md max-w-full object-cover object-center"
                          />
                        ) : file.type === "video" ? (
                          <video
                            key={file.url}
                            src={file.url}
                            controls
                            className="rounded-md max-w-full"
                          />
                        ) : (
                          <a
                            key={file.url}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-200"
                          >
                            {file.name || "Download File"}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center px-4">
            <h1 className="text-gray-500 text-sm sm:text-base text-center">
              This is the start of your conversation with{" "}
              {otherUser ? otherUser.user.name : "Unknown"}
            </h1>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3 pb-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-gray-300"
            >
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           hover:bg-red-600 shadow-lg"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 justify-end relative">
        <CldUploadWidget
          uploadPreset="NepaliPoolChat"
          options={{
            resourceType: "auto",
            multiple: true,
          }}
          onSuccess={(result) => {
            // console.log(" Upload success, full result:", result);
            const info = result.info as CloudinaryUploadWidgetInfo;
            // console.log(" Info object:", info);
            // console.log(" Secure URL:", info?.secure_url);
            // console.log("Original filename:", info?.original_filename);

            if (info && typeof info === "object" && "secure_url" in info) {
              const newFile = {
                url: info.secure_url,
                name: info.original_filename || "uploaded-file",
                type: getFileType(info),
              };
              console.log("➕ Adding file to state:", newFile);

              setUploadedFiles((prev) => {
                const updated = [...prev, newFile];
                console.log(" Updated uploadedFiles array:", updated);
                return updated;
              });
            } else {
              console.error("Invalid info object structure");
            }
          }}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center justify-center p-2 sm:px-4 sm:py-3 text-slate-700 hover:bg-slate-100
                rounded-full transition-all duration-200 cursor-pointer flex-shrink-0"
              >
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            );
          }}
        </CldUploadWidget>
        <Input
          className="rounded-full border-gray-400 pr-10 sm:pr-12 text-sm sm:text-base"
          type="text"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          onKeyDown={(e) => e.key === "Enter" && !pending && handleSend()}
          disabled={pending}
          placeholder="Type a message..."
        />
        <div className="absolute bottom-2 sm:bottom-2.5 right-3 sm:right-4">
          <button
            className="bg-transparent text-black hover:bg-transparent cursor-pointer hover:scale-105 duration-300 transition-all disabled:opacity-50"
            onClick={handleSend}
            disabled={
              pending || (!messageText.trim() && uploadedFiles.length === 0)
            }
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
