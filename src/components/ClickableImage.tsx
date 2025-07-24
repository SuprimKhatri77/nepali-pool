"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ZoomIn } from "lucide-react"
import { ImageModal } from "./ImageModel"

interface ClickableImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

export function ClickableImage({ src, alt, width, height, className }: ClickableImageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="relative group cursor-pointer select-none" onClick={handleImageClick}>
                <Image
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`transition-all duration-200 group-hover:scale-[1.02] ${className}`}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center rounded-md">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <ZoomIn className="h-5 w-5 text-gray-700" />
                    </div>
                </div>

                {/* Click hint */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">Click to enlarge</div>
                </div>
            </div>

            {isModalOpen && (
                <ImageModal
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}
