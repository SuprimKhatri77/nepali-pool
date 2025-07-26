"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useUploadThing } from "@/utils/uploadthing"

interface Props {
    currentImage?: string;
    onUploadComplete: (url: string) => void;
    imageUploadName?: string;
}

export default function CustomProfileUploader({ currentImage, onUploadComplete, imageUploadName }: Props) {
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
            <button
                type="button"
                className=""
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
            >
                {imageUploadName === "Profile Image" && (


                    <div className="flex items-center gap-1">

                        {isUploading ? "Uploading..." : (



                            !currentImage ? (

                                <Image src="/profile.png"
                                    alt="Profile Picture"
                                    width={200}
                                    height={200}
                                    className="rounded-full"
                                >
                                </Image>


                            ) : (

                                <Image src={currentImage}
                                    alt="Profile Picture"
                                    width={200}
                                    height={200}
                                    className="rounded-full"
                                >
                                </Image>

                            ))}

                    </div>

                )}



                {imageUploadName === "Resume Image" && (


                    <div className="flex items-center gap-1">
                        {isUploading ? "Uploading..." :
                            (
                                <p className="shadow-md w-full  p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200">


                                    Browse... No file selected



                                </p>

                            )}

                    </div>

                )}


                {imageUploadName === "Citizenship Image" && (


                    <div className="flex items-center gap-1">
                        {isUploading ? "Uploading..." :
                            (
                                <p className="shadow-md w-full  p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200">


                                    Browse... No file selected

                                </p>

                            )}

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
