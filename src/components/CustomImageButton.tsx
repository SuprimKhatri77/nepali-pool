"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useUploadThing } from "@/utils/uploadthing"
import { ImageIcon } from "lucide-react";

interface Props {
    currentImage?: string;
    onUploadComplete: (url: string) => void;
    imageUploadName: string;
}

export default function CustomProfileUploader({ currentImage, onUploadComplete, imageUploadName }: Props) {
    const [showButton, setShowButton] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { startUpload, isUploading } = useUploadThing("imageUploader")

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const filesArray = Array.from(files)

        const uploaded = await startUpload(filesArray)
        if (uploaded && uploaded[0]?.ufsUrl) {
            onUploadComplete(uploaded[0].ufsUrl)
        }
    }

    return (
        <div className="flex items-center gap-4">
            {currentImage && (
                <div className="relative w-14 h-14">
                    <Image
                        src={currentImage}
                        alt="Uploaded preview"
                        fill
                        className="rounded-md object-cover border"
                    />
                </div>
            )}

            <button
                type="button"
                className="bg-gray-50 shadow-xl hover:bg-gray-100 transition-all duration-300 text-black text-sm px-2 cursor-pointer rounded-md text-nowrap py-2"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : (
                    <div className="flex items-center gap-1">
                        {imageUploadName}
                        <ImageIcon />
                    </div>
                )}
            </button>

            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>

    )
}
