"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Eye, EyeOff } from "lucide-react"

interface ResultPanelProps {
  originalImage: string | null
  isEncrypted: boolean
}

export default function ResultPanel({ originalImage, isEncrypted }: ResultPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  if (!originalImage) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-full bg-gray-800 p-4">
            <svg
              className="h-10 w-10 text-gray-500"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <line x1="16" x2="22" y1="5" y2="5" />
              <line x1="19" x2="19" y1="2" y2="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300">No Results Yet</h3>
          <p className="mt-2 text-sm text-gray-500">Upload an image and run encryption to see results</p>
        </div>
      </div>
    )
  }

  // In a real app, we would have the actual encrypted image
  // For this demo, we'll simulate it by applying a CSS filter
  const encryptedImageStyle = {
    filter: "hue-rotate(180deg) saturate(150%) contrast(120%)",
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-cyan-400">Results</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
            className="h-8 border-gray-700 text-xs text-gray-300 hover:bg-gray-800"
          >
            {showOriginal ? (
              <>
                <EyeOff className="mr-1 h-3 w-3" /> Hide Original
              </>
            ) : (
              <>
                <Eye className="mr-1 h-3 w-3" /> Show Original
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" className="h-8 border-gray-700 text-xs text-gray-300 hover:bg-gray-800">
            <Download className="mr-1 h-3 w-3" /> Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="h-[calc(100%-40px)]">
          <div className="flex h-full flex-col gap-4">
            <div className="relative flex-1 rounded-lg bg-gray-800 p-2">
              <div className="flex h-full items-center justify-center">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt={isEncrypted ? "Encrypted image" : "Original image"}
                  className="max-h-full max-w-full rounded"
                  style={isEncrypted ? encryptedImageStyle : undefined}
                />
              </div>

              {showOriginal && isEncrypted && (
                <div className="absolute bottom-4 right-4 w-1/3 overflow-hidden rounded border-2 border-cyan-500 shadow-lg">
                  <div className="bg-gray-900 px-2 py-1 text-xs text-cyan-400">Original Image</div>
                  <img src={originalImage || "/placeholder.svg"} alt="Original image" className="w-full" />
                </div>
              )}
            </div>

            <div className="rounded-lg bg-gray-800 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-300">Image Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                  <p className="flex justify-between">
                    <span>Status:</span>
                    <span className={isEncrypted ? "text-cyan-400" : "text-purple-400"}>
                      {isEncrypted ? "Encrypted" : "Original"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Algorithm:</span>
                    <span>Graph-based DFS</span>
                  </p>
                </div>
                <div>
                  <p className="flex justify-between">
                    <span>Encryption Level:</span>
                    <span>256-bit</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Processing Time:</span>
                    <span>1.2s</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="h-[calc(100%-40px)]">
          <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-800 p-6">
            <div className="text-center">
              <div className="mb-4 rounded-full bg-gray-700 p-4">
                <svg
                  className="h-10 w-10 text-gray-500"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Data Analysis</h3>
              <p className="mt-2 text-sm text-gray-500">
                Detailed histogram and pixel distribution analysis would appear here
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="h-[calc(100%-40px)]">
          <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-800 p-6">
            <div className="text-center">
              <div className="mb-4 rounded-full bg-gray-700 p-4">
                <svg
                  className="h-10 w-10 text-gray-500"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Security Metrics</h3>
              <p className="mt-2 text-sm text-gray-500">
                Encryption strength analysis and security metrics would appear here
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
