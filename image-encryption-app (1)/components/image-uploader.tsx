"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void
  currentImage: string | null
}

export default function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = () => {
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-700 bg-gray-800 transition-colors",
          isDragging && "border-cyan-500 bg-gray-900",
          currentImage && "border-none p-0",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? (
          <div className="relative h-full w-full">
            <img
              src={currentImage || "/placeholder.svg"}
              alt="Uploaded image"
              className="h-full w-full rounded-md object-contain"
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-gray-900 p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                handleClearImage()
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <ImageIcon className="mb-2 h-10 w-10 text-gray-500" />
            <p className="text-sm text-gray-400">Drag & drop an image or click to browse</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-gray-500 hover:text-cyan-400"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Upload className="mr-1 h-3 w-3" /> Select file
            </Button>
          </>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />
    </div>
  )
}
