import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { cn } from "@/components/lib/utils";
import type {
  ChatAttachment,
  ChatMessage,
} from "../../../server/actions/chats/messages";

export function MessageBubble({
  message,
  mine,
}: {
  message: ChatMessage;
  mine: boolean;
}) {
  const hasText = Boolean(message.message?.trim());

  return (
    <div className={cn("mb-4 flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] overflow-hidden rounded-2xl sm:max-w-md",
          hasText
            ? mine
              ? "bg-emerald-600 text-white shadow-sm"
              : "border border-gray-100 bg-gray-50 text-gray-900 shadow-sm"
            : "bg-transparent",
        )}
      >
        {hasText && (
          <p className="whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-relaxed sm:px-5">
            {message.message}
          </p>
        )}
        {message.attachments.length > 0 && (
          <div className={cn("space-y-2", hasText ? "px-2 pb-2" : "p-2")}>
            {message.attachments.map((file) => (
              <Attachment key={file.id} file={file} mine={mine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function isPdf(file: ChatAttachment) {
  return file.type === "pdf" || Boolean(file.name?.toLowerCase().endsWith(".pdf"));
}

function Attachment({ file, mine }: { file: ChatAttachment; mine: boolean }) {
  if (file.type === "image") {
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-lg"
      >
        <Image
          src={file.url}
          alt={file.name || "Attachment"}
          width={300}
          height={300}
          className="h-auto w-full rounded-lg object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all duration-200 group-hover:bg-black/30">
          <Download
            className="text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100"
            size={28}
          />
        </span>
      </a>
    );
  }

  if (file.type === "video") {
    return (
      <video
        src={file.url}
        controls
        preload="metadata"
        className="w-full rounded-lg"
      />
    );
  }

  const pdf = isPdf(file);
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-all duration-200",
        mine
          ? "bg-emerald-700 hover:bg-emerald-800"
          : "border border-gray-100 bg-white shadow-sm hover:bg-gray-50",
      )}
    >
      <span
        className={cn(
          "rounded-lg p-2.5",
          mine ? "bg-emerald-800" : pdf ? "bg-red-50" : "bg-gray-50",
        )}
      >
        <FileText
          size={20}
          className={
            mine ? "text-white" : pdf ? "text-red-600" : "text-gray-600"
          }
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            mine ? "text-white" : "text-gray-900",
          )}
        >
          {file.name || "Download file"}
        </span>
        <span
          className={cn(
            "block text-xs font-medium uppercase",
            mine ? "text-emerald-100" : "text-gray-500",
          )}
        >
          {pdf ? "PDF document" : file.type || "File"}
        </span>
      </span>
      <Download
        size={18}
        className={mine ? "text-emerald-200" : "text-gray-400"}
      />
    </a>
  );
}
