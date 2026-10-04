"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { toast } from "sonner";
import { Film, FileText, ImageIcon, Loader2, SendHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/lib/utils";
import { useSendChatMessage } from "@/modules/chats/queries";
import { getFileType } from "./file-type";

// sendChatMessage accepts at most this many files per message.
const MAX_ATTACHMENTS = 10;

type PendingFile = { id: string; url: string; name: string; type: string };

export function ChatComposer({ chatId }: { chatId: string }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const send = useSendChatMessage(chatId);
  const canSend = !send.isPending && (text.trim() !== "" || files.length > 0);

  const submit = () => {
    if (!canSend) return;
    send.mutate(
      {
        text: text.trim(),
        files: files.map(({ url, name, type }) => ({ url, name, type })),
      },
      {
        // On failure the text and files stay, so nothing has to be retyped.
        onSuccess: () => {
          setText("");
          setFiles([]);
          requestAnimationFrame(() => inputRef.current?.focus());
        },
      },
    );
  };

  return (
    <div className="border-t border-gray-100 bg-white">
      {files.length > 0 && (
        <div className="px-3 pt-3 sm:px-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-emerald-900">
                {files.length} file{files.length > 1 ? "s" : ""} attached
              </p>
              <button
                type="button"
                onClick={() => setFiles([])}
                disabled={send.isPending}
                className="text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((file) => (
                <FilePreview
                  key={file.id}
                  file={file}
                  disabled={send.isPending}
                  onRemove={() =>
                    setFiles((prev) => prev.filter((f) => f.id !== file.id))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-2 py-3 sm:px-3">
        <CldUploadWidget
          uploadPreset="NepaliPoolChat"
          options={{ resourceType: "auto", multiple: true, maxFiles: MAX_ATTACHMENTS }}
          onSuccess={(result) => {
            const info = result.info;
            if (!info || typeof info !== "object") return;
            const upload: CloudinaryUploadWidgetInfo = info;
            setFiles((prev) => {
              if (prev.length >= MAX_ATTACHMENTS) {
                toast.error(
                  `You can attach up to ${MAX_ATTACHMENTS} files per message.`,
                );
                return prev;
              }
              return [
                ...prev,
                {
                  id: upload.public_id,
                  url: upload.secure_url,
                  name: upload.original_filename || "uploaded-file",
                  type: getFileType(upload),
                },
              ];
            });
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={send.isPending}
              aria-label="Attach files"
              className="flex shrink-0 items-center justify-center rounded-full border border-transparent p-2.5 text-emerald-600 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 sm:p-3"
            >
              <ImageIcon className="size-5 sm:size-6" />
            </button>
          )}
        </CldUploadWidget>

        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            maxLength={5000}
            placeholder="Type a message..."
            aria-label="Message"
            className="rounded-full border-gray-200 py-2.5 pr-12 text-sm focus:border-emerald-300 focus:ring-emerald-200 sm:py-3 sm:text-base"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 transition-all duration-200 hover:scale-110 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {send.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <SendHorizontal className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilePreview({
  file,
  disabled,
  onRemove,
}: {
  file: PendingFile;
  disabled: boolean;
  onRemove: () => void;
}) {
  const pdf = file.type === "pdf" || file.name.toLowerCase().endsWith(".pdf");

  return (
    <div className="group relative overflow-hidden rounded-xl border-2 border-emerald-100 bg-white shadow-sm transition-all duration-200 hover:border-emerald-300">
      {file.type === "image" ? (
        <div className="relative aspect-square">
          <Image src={file.url} alt={file.name} fill className="object-cover" />
          <FileName name={file.name} />
        </div>
      ) : file.type === "video" ? (
        <div className="relative flex aspect-square items-center justify-center bg-gray-50">
          <Film size={36} className="text-emerald-500" />
          <FileName name={file.name} />
        </div>
      ) : (
        <div
          className={cn(
            "flex aspect-square flex-col items-center justify-center p-3",
            pdf ? "bg-red-50" : "bg-gray-50",
          )}
        >
          <FileText
            size={36}
            className={cn("mb-2", pdf ? "text-red-500" : "text-gray-400")}
          />
          <p className="w-full truncate px-1 text-center text-xs font-medium text-gray-700">
            {file.name}
          </p>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            {pdf ? "PDF" : file.type || "File"}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-red-600 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function FileName({ name }: { name: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
      <p className="truncate text-xs font-medium text-white">{name}</p>
    </div>
  );
}
