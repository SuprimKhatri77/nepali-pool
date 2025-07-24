"use client"
import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
    src: string
    alt: string
    isOpen: boolean
    onClose: () => void
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
            document.body.style.overflow = "hidden" // Prevent background scroll
        }

        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

            <div className="relative z-10 max-w-[95vw] max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="relative">
                    <Image
                        src={src || "/placeholder.svg"}
                        alt={alt}
                        width={1000}
                        height={800}
                        className="max-w-full max-h-[90vh] object-contain"
                        priority
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{alt}</p>
                </div>
            </div>
        </div>
    )
}
