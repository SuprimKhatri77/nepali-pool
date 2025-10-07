"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getMessages, getMoreMessages } from "../../server/helper/getMessages";
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
import { ImageIcon, X, Download, FileText, Film } from "lucide-react";
import { sendAttachments } from "../../server/actions/send-attachments/sendAttachments";
import { getFileType } from "../../server/helper/getFileType";
import { PaymentButton } from "./PaymentButton";
import { Button } from "./ui/button";

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

const MESSAGES_PER_PAGE = 20;

const Message = ({ role, chatId, currentUser, chatRecord }: Props) => {
  const [messages, setMessages] = useState<MessagesWithUser[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; name: string; type: string; id: string }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [oldestMessageId, setOldestMessageId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const previousScrollHeight = useRef(0);

  let otherUser = null;
  if (chatRecord.studentId === currentUser.id) {
    otherUser = chatRecord.mentorProfile;
  } else if (chatRecord.mentorId === currentUser.id) {
    otherUser = chatRecord.studentProfile;
  } else {
    console.warn("Current user is neither student nor mentor in this chat");
    otherUser = null;
  }

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      setLoadingMessage(true);
      try {
        const result = await getMessages(chatId, MESSAGES_PER_PAGE);
        if (result.success) {
          console.log("Fetched messages:", result.messages.length);
          setMessages(result.messages);
          setHasMore(result.hasMore);

          if (result.messages.length > 0) {
            setOldestMessageId(result.messages[0].id);
          }

          setTimeout(() => scrollToBottom("auto"), 100);
          isInitialLoad.current = false;
        } else {
          console.error("Error:", result.error);
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Error fetching messages.");
      } finally {
        setLoadingMessage(false);
      }
    }
    fetchMessages();
  }, [chatId, scrollToBottom]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore || !oldestMessageId) return;

    setIsLoadingMore(true);
    const container = messagesContainerRef.current;
    if (container) {
      previousScrollHeight.current = container.scrollHeight;
    }

    try {
      const result = await getMoreMessages(
        chatId,
        oldestMessageId,
        MESSAGES_PER_PAGE
      );

      if (result.success && result.messages.length > 0) {
        setMessages((prev) => [...result.messages, ...prev]);
        setHasMore(result.hasMore);
        setOldestMessageId(result.messages[0].id);

        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop =
              newScrollHeight - previousScrollHeight.current;
          }
        }, 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      toast.error("Error loading more messages");
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, oldestMessageId, hasMore, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isInitialLoad.current
        ) {
          loadMoreMessages();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreMessages]);

  useEffect(() => {
    const supabase = createClient();

    console.log("Setting up real-time subscription for chat:", chatRecord.id);

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
            console.log("Added new message. Total:", updated.length);

            setTimeout(() => scrollToBottom(), 100);

            return updated;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message_attachments",
        },
        (payload) => {
          console.log("📎 New attachment received:", payload);
          const rawData = payload.new as any;

          const newAttachment = {
            id: rawData.id,
            messageId: rawData.message_id,
            url: rawData.url,
            type: rawData.type,
            name: rawData.name,
            createdAt: rawData.created_at,
          };

          setMessages((prevMessages) => {
            return prevMessages.map((msg) => {
              if (msg.id === newAttachment.messageId) {
                const attachmentExists = msg.messageAttachments.some(
                  (att) => att.id === newAttachment.id
                );

                if (!attachmentExists) {
                  console.log("Added attachment to message:", msg.id);
                  return {
                    ...msg,
                    messageAttachments: [
                      ...msg.messageAttachments,
                      newAttachment,
                    ],
                  };
                }
              }
              return msg;
            });
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
              "Successfully subscribed to real-time for chat:",
              chatRecord.id
            );
            break;
          case "CHANNEL_ERROR":
            console.error("Channel error for chat:", chatRecord.id);
            toast.error("Real-time connection error");
            break;
          case "TIMED_OUT":
            console.error("Subscription timed out for chat:", chatRecord.id);
            toast.error("Real-time connection timed out");
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
  }, [chatRecord.id, scrollToBottom]);

  const handleSend = async () => {
    if (!messageText.trim() && uploadedFiles.length === 0) return;
    setPending(true);

    try {
      const result = await sendMessage(
        messageText.trim() || "",
        currentUser.id,
        chatRecord.id,
        uploadedFiles.length > 0
      );

      if (!result.success) {
        toast.error(result.error || "Failed to send message");
        return;
      }

      if (uploadedFiles.length > 0 && result.messageId) {
        const attachResult = await sendAttachments(
          result.messageId,
          uploadedFiles,
          chatRecord.id
        );
        if (!attachResult.success) {
          toast.error("Message sent but attachments failed");
        }
      }

      setMessageText("");
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending message");
    } finally {
      setPending(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 rounded-xl py-3 sm:py-5 px-2 sm:px-4 flex flex-col gap-3 sm:gap-4">
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

      {chatRecord.status !== "active" ? (
        <div className="flex flex-col gap-5 items-center justify-center h-full">
          <h1 className="text-lg font-medium flex gap-1">
            Your susbcription to chat with
            <span className="font-bold capitalize">
              {chatRecord.mentorProfile.user.name}
            </span>
            has expied, consider renewing it!
          </h1>
          <PaymentButton
            mentorId={chatRecord.mentorId}
            userId={currentUser.id}
            userEmail={currentUser.email}
            paymentType="chat_subscription"
          >
            Renew Chat Subscription
          </PaymentButton>
        </div>
      ) : (
        <>
          <div
            ref={messagesContainerRef}
            className={`flex flex-1 flex-col ${
              loadingMessage ? "items-center justify-center" : "justify-end"
            } overflow-y-auto`}
          >
            {loadingMessage ? (
              <Loader />
            ) : (
              <>
                <div
                  ref={observerTarget}
                  className="h-4 flex justify-center py-2"
                >
                  {isLoadingMore && (
                    <div className="inline-block border-blue-400 h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent" />
                  )}
                  {!hasMore && messages.length > MESSAGES_PER_PAGE && (
                    <p className="text-xs text-gray-400">No more messages</p>
                  )}
                </div>

                {chatRecord.status === "active" ? (
                  messages.length > 0 ? (
                    messages.map((message) => {
                      const isCurrentUser = message.senderId === currentUser.id;
                      const hasText = Boolean(message.message?.trim());

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          } mb-3`}
                        >
                          <div
                            className={`rounded-lg max-w-[75%] sm:max-w-md overflow-hidden ${
                              hasText
                                ? isCurrentUser
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-black"
                                : "bg-transparent"
                            }`}
                          >
                            {message.message && (
                              <p className="px-3 sm:px-4 py-2">
                                {message.message}
                              </p>
                            )}

                            {message.messageAttachments?.length > 0 && (
                              <div
                                className={`${
                                  message.message ? "pt-0" : "p-2"
                                } space-y-2`}
                              >
                                {message.messageAttachments.map((file: any) => {
                                  if (file.type === "image") {
                                    return (
                                      <div
                                        key={file.url}
                                        className="relative group cursor-pointer"
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                      >
                                        <Image
                                          src={file.url}
                                          alt={file.name || "attachment"}
                                          width={300}
                                          height={300}
                                          className="w-full h-auto rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                          <Download
                                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            size={24}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (file.type === "video") {
                                    return (
                                      <div
                                        key={file.url}
                                        className="relative rounded-lg overflow-hidden"
                                      >
                                        <video
                                          src={file.url}
                                          controls
                                          className="w-full rounded-lg"
                                          preload="metadata"
                                        />
                                      </div>
                                    );
                                  }

                                  const isPDF =
                                    file.type === "pdf" ||
                                    file.name?.toLowerCase().endsWith(".pdf");

                                  return (
                                    <a
                                      key={file.url}
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                        isCurrentUser
                                          ? "bg-blue-600 hover:bg-blue-700"
                                          : "bg-white hover:bg-gray-50 shadow-sm"
                                      }`}
                                    >
                                      <div
                                        className={`p-2 rounded-lg ${
                                          isCurrentUser
                                            ? "bg-blue-700"
                                            : isPDF
                                              ? "bg-red-100"
                                              : "bg-gray-100"
                                        }`}
                                      >
                                        <FileText
                                          size={20}
                                          className={
                                            isCurrentUser
                                              ? "text-white"
                                              : isPDF
                                                ? "text-red-600"
                                                : "text-gray-600"
                                          }
                                        />
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-sm font-medium truncate ${
                                            isCurrentUser
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {file.name || "Download File"}
                                        </p>
                                        <p
                                          className={`text-xs uppercase ${
                                            isCurrentUser
                                              ? "text-blue-100"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {isPDF
                                            ? "PDF Document"
                                            : file.type || "File"}
                                        </p>
                                      </div>

                                      <Download
                                        size={18}
                                        className={
                                          isCurrentUser
                                            ? "text-blue-200"
                                            : "text-gray-400"
                                        }
                                      />
                                    </a>
                                  );
                                })}
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
                  )
                ) : (
                  <div>
                    <h1>
                      Your chat subscription with this mentor has expired,
                      considering purchasing the pack again to chat!
                    </h1>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="px-2 pb-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600">
                    {uploadedFiles.length} file
                    {uploadedFiles.length > 1 ? "s" : ""} attached
                  </p>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 bg-white"
                    >
                      {file.type === "image" ? (
                        <div className="aspect-square relative">
                          <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-xs text-white truncate font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ) : file.type === "video" ? (
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          <Film size={32} className="text-gray-400" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-xs text-white truncate font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`aspect-square relative flex flex-col items-center justify-center p-2 ${
                            file.type === "pdf" ||
                            file.name?.toLowerCase().endsWith(".pdf")
                              ? "bg-red-50"
                              : "bg-gray-100"
                          }`}
                        >
                          <FileText
                            size={32}
                            className={`mb-1 ${
                              file.type === "pdf" ||
                              file.name?.toLowerCase().endsWith(".pdf")
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <p className="text-xs text-gray-600 truncate w-full text-center font-medium">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase">
                            {file.type === "pdf" ||
                            file.name?.toLowerCase().endsWith(".pdf")
                              ? "PDF"
                              : file.type || "File"}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5
                               opacity-0 group-hover:opacity-100 transition-all duration-200
                               hover:bg-red-600 hover:scale-110 shadow-lg z-10"
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                const info = result.info as CloudinaryUploadWidgetInfo;

                if (info && typeof info === "object" && "secure_url" in info) {
                  const newFile = {
                    url: info.secure_url,
                    name: info.original_filename || "uploaded-file",
                    type: getFileType(info),
                    id: info.public_id,
                  };
                  console.log("Adding file to state:", newFile);

                  setUploadedFiles((prev) => {
                    const updated = [...prev, newFile];
                    console.log("Updated uploadedFiles array:", updated);
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
        </>
      )}
    </div>
  );
};

export default Message;
