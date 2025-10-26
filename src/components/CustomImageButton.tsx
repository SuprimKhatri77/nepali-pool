"use client";
import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import { useUploadThing } from "@/utils/uploadthing";
import {
  Upload,
  FileText,
  IdCard,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "./lib/utils";

interface Props {
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  imageUploadName?: string;
}

export default function CustomProfileUploader({
  currentImage,
  onUploadComplete,
  imageUploadName,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    const uploaded = await startUpload(filesArray);
    if (uploaded && uploaded[0]?.ufsUrl) {
      onUploadComplete(uploaded[0].ufsUrl);
    }
  };

  const getIcon = () => {
    if (imageUploadName?.toLowerCase().includes("resume")) {
      return <FileText className="h-5 w-5" />;
    }
    if (imageUploadName?.toLowerCase().includes("citizenship")) {
      return <IdCard className="h-5 w-5" />;
    }
    return <Upload className="h-5 w-5" />;
  };

  if (imageUploadName === "Profile Picture") {
    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-400 transition-all duration-200 shadow-sm">
            <Image
              src={
                currentImage ||
                "https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE"
              }
              alt="Profile Picture"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
        </button>

        <div className="">
          <p className="text-sm font-medium text-gray-700">
            {isUploading ? "Uploading..." : "Upload photo"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Click to change</p>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // Document Upload (Resume, Citizenship, etc.)
  return (
    <div className="w-full">
      {!currentImage ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="relative w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-200",
              "border-gray-300 bg-gray-50/50 hover:border-emerald-400 hover:bg-emerald-50/50",
              isUploading && "cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                <span className="text-sm font-medium text-gray-700 mt-1">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-white rounded-lg border border-gray-200 group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all duration-200 shadow-sm">
                  <div className="text-gray-600 group-hover:text-emerald-600 transition-colors">
                    {getIcon()}
                  </div>
                </div>
                <div className="text-center mt-1">
                  <p className="text-sm font-medium text-gray-900">
                    {imageUploadName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                </div>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="w-full border border-emerald-200 bg-emerald-50/30 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-emerald-200 bg-white shadow-sm">
                <Image
                  src={currentImage}
                  alt={imageUploadName || "Uploaded document"}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {imageUploadName}
                  </p>
                  <p className="text-xs text-gray-500">Uploaded successfully</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => window.open(currentImage, "_blank")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload className="h-3 w-3" />
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
