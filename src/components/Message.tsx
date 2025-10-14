"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getMessages, getMoreMessages } from "../../server/helper/getMessages";
import type {
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
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { ImageIcon, X, Download, FileText, Film } from "lucide-react";
import { sendAttachments } from "../../server/actions/send-attachments/sendAttachments";
import { getFileType } from "../../server/helper/getFileType";
import { PaymentButton } from "./PaymentButton";

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
  const inputRef = useRef<HTMLInputElement>(null);

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

    // console.log("Setting up real-time subscription for chat:", chatRecord.id);

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          // console.log("New message received:", payload);

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
              // console.log("Message already exists, skipping");
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
          // console.log("📎 New attachment received:", payload);
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
        // console.log("Subscription status:", status);
        if (err) {
          // console.error("Subscription error:", err);
        }

        switch (status) {
          case "SUBSCRIBED":
            // console.log(
            //   "Successfully subscribed to real-time for chat:",
            //   chatRecord.id
            // );
            break;
          case "CHANNEL_ERROR":
            // console.error("Channel error for chat:", chatRecord.id);
            // toast.error("Real-time connection error");
            break;
          case "TIMED_OUT":
            // console.error("Subscription timed out for chat:", chatRecord.id);
            // toast.error("Real-time connection timed out");
            break;
          case "CLOSED":
            // console.log("Subscription closed for chat:", chatRecord.id);
            break;
        }
      });

    return () => {
      // console.log("Cleaning up channel for chat:", chatRecord.id);
      supabase.removeChannel(channel);
    };
  }, [chatId, scrollToBottom]);

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
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1);
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
    <div className="min-h-screen w-full   bg-white rounded-xl flex flex-col shadow-sm border border-gray-100 z-30">
      <div className=" bg-white sticky  top-12 z-20 rounded-t-xl py-4 sm:py-5 px-3 sm:px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 relative rounded-full flex-shrink-0 ring-2 ring-emerald-100">
            {otherUser?.imageUrl ? (
              <Image
                src={otherUser.imageUrl! || "/placeholder.svg"}
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
          <p className="text-base sm:text-lg font-semibold capitalize truncate text-gray-900">
            {otherUser?.user?.name || ""}
          </p>
        </div>
      </div>

      {chatRecord.status !== "active" ? (
        <div className="flex flex-col gap-6 items-center justify-center h-full p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md">
            <h1 className="text-base font-medium text-gray-800 text-center leading-relaxed">
              Your subscription to chat with{" "}
              <span className="font-bold capitalize text-emerald-700">
                {chatRecord.mentorProfile.user.name}
              </span>{" "}
              has expired. Consider renewing it to continue the conversation!
            </h1>
          </div>
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
            } overflow-y-auto px-2 sm:px-4`}
          >
            {loadingMessage ? (
              <Loader />
            ) : (
              <>
                <div
                  ref={observerTarget}
                  className="h-4 flex justify-center py-4"
                >
                  {isLoadingMore && (
                    <div className="inline-block border-emerald-500 h-5 w-5 animate-spin rounded-full border-2 border-solid border-e-transparent" />
                  )}
                  {!hasMore && messages.length > MESSAGES_PER_PAGE && (
                    <p className="text-xs text-gray-400 font-medium">
                      No more messages
                    </p>
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
                          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
                        >
                          <div
                            className={`rounded-2xl max-w-[75%] sm:max-w-md overflow-hidden ${
                              hasText
                                ? isCurrentUser
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "bg-gray-50 text-gray-900 border border-gray-100 shadow-sm"
                                : "bg-transparent"
                            }`}
                          >
                            {message.message && (
                              <p className="px-4 sm:px-5 py-2.5 leading-relaxed text-[15px]">
                                {message.message}
                              </p>
                            )}

                            {message.messageAttachments?.length > 0 && (
                              <div
                                className={`${message.message ? "pt-0 pb-2 px-2" : "p-2"} space-y-2`}
                              >
                                {message.messageAttachments.map((file: any) => {
                                  if (file.type === "image") {
                                    return (
                                      <div
                                        key={file.url}
                                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                      >
                                        <Image
                                          src={file.url || "/placeholder.svg"}
                                          alt={file.name || "attachment"}
                                          width={300}
                                          height={300}
                                          className="w-full h-auto rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                          <Download
                                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                                            size={28}
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
                                          ? "bg-emerald-700 hover:bg-emerald-800"
                                          : "bg-white hover:bg-gray-50 shadow-sm border border-gray-100"
                                      }`}
                                    >
                                      <div
                                        className={`p-2.5 rounded-lg ${
                                          isCurrentUser
                                            ? "bg-emerald-800"
                                            : isPDF
                                              ? "bg-red-50"
                                              : "bg-gray-50"
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
                                          className={`text-xs uppercase font-medium ${
                                            isCurrentUser
                                              ? "text-emerald-100"
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
                                            ? "text-emerald-200"
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
                    <div className="h-full flex items-center justify-center px-4 py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <h1 className="text-gray-600 text-sm sm:text-base font-medium">
                          Start your conversation with{" "}
                          <span className="text-emerald-700 font-semibold">
                            {otherUser ? otherUser.user.name : "Unknown"}
                          </span>
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                          Send a message to begin chatting
                        </p>
                      </div>
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
            <div className="px-3 sm:px-4 pb-3">
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-emerald-900">
                    {uploadedFiles.length} file
                    {uploadedFiles.length > 1 ? "s" : ""} attached
                  </p>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative group rounded-xl overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200 bg-white shadow-sm"
                    >
                      {file.type === "image" ? (
                        <div className="aspect-square relative">
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                            <p className="text-xs text-white truncate font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ) : file.type === "video" ? (
                        <div className="aspect-square relative bg-gray-50 flex items-center justify-center">
                          <Film size={36} className="text-emerald-500" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                            <p className="text-xs text-white truncate font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`aspect-square relative flex flex-col items-center justify-center p-3 ${
                            file.type === "pdf" ||
                            file.name?.toLowerCase().endsWith(".pdf")
                              ? "bg-red-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <FileText
                            size={36}
                            className={`mb-2 ${
                              file.type === "pdf" ||
                              file.name?.toLowerCase().endsWith(".pdf")
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <p className="text-xs text-gray-700 truncate w-full text-center font-medium px-1">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase mt-1 font-medium">
                            {file.type === "pdf" ||
                            file.name?.toLowerCase().endsWith(".pdf")
                              ? "PDF"
                              : file.type || "File"}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5
                               opacity-0 group-hover:opacity-100 transition-all duration-200
                               hover:bg-red-600 hover:scale-110 shadow-lg z-10"
                        aria-label="Remove file"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex border-t border-gray-100 py-3 items-center gap-2 justify-end relative px-2 sm:px-3 bg-white">
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
                    className="flex items-center justify-center p-2.5 sm:p-3 text-emerald-600 hover:bg-emerald-50
                rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 border border-transparent hover:border-emerald-200"
                  >
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                );
              }}
            </CldUploadWidget>
            <Input
              className="rounded-full border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 pr-11 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3"
              type="text"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
              onKeyDown={(e) => e.key === "Enter" && !pending && handleSend()}
              ref={inputRef}
              disabled={pending}
              placeholder="Type a message..."
            />
            <div className="absolute bottom-5 sm:bottom-5 right-4 sm:right-5">
              <button
                className="bg-transparent text-emerald-600 hover:text-emerald-700 hover:bg-transparent cursor-pointer hover:scale-110 duration-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={
                  pending || (!messageText.trim() && uploadedFiles.length === 0)
                }
              >
                {pending ? (
                  <div className="inline-block border-emerald-600 h-5 w-5 animate-spin rounded-full border-2 border-solid border-e-transparent">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
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
