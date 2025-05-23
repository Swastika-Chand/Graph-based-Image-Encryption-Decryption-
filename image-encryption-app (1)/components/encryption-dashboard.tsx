"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Unlock, Play, Pause, SkipForward, RotateCcw, Info, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ImageUploader from "@/components/image-uploader"
import GraphVisualizer from "@/components/graph-visualizer"
import EncryptionSettings from "@/components/encryption-settings"
import ResultPanel from "@/components/result-panel"

export default function EncryptionDashboard() {
  const [image, setImage] = useState<string | null>(null)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [algorithm, setAlgorithm] = useState<"dfs" | "bfs">("dfs")
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [showSettings, setShowSettings] = useState(true)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setIsEncrypted(false)
  }

  const handleEncrypt = () => {
    if (!image) return
    setIsAnimating(true)
    // In a real app, this would trigger the encryption process
    setTimeout(() => {
      setIsEncrypted(true)
      setIsAnimating(false)
    }, 3000)
  }

  const handleDecrypt = () => {
    if (!image || !isEncrypted) return
    setIsAnimating(true)
    // In a real app, this would trigger the decryption process
    setTimeout(() => {
      setIsEncrypted(false)
      setIsAnimating(false)
    }, 3000)
  }

  const handleReset = () => {
    setImage(null)
    setIsEncrypted(false)
    setIsAnimating(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-950 to-black p-4 text-white">
      <header className="mb-4 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-tight text-cyan-500"
        >
          GRAPHCRYPT<span className="text-sm text-cyan-700">.io</span>
        </motion.h1>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                  {showSettings ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showSettings ? "Hide" : "Show"} Settings Panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About GraphCrypt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Panel - Image Upload & Controls */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-gray-900 p-4"
          >
            <h2 className="mb-4 text-lg font-medium text-cyan-400">Image Input</h2>
            <ImageUploader onImageUpload={handleImageUpload} currentImage={image} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-gray-900 p-4"
          >
            <h2 className="mb-4 text-lg font-medium text-cyan-400">Controls</h2>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleEncrypt}
                disabled={!image || isAnimating || isEncrypted}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                <Lock className="mr-2 h-4 w-4" /> Encrypt Image
              </Button>

              <Button
                onClick={handleDecrypt}
                disabled={!image || isAnimating || !isEncrypted}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Unlock className="mr-2 h-4 w-4" /> Decrypt Image
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </motion.div>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-gray-900 p-4"
            >
              <h2 className="mb-4 text-lg font-medium text-cyan-400">Animation Controls</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Animation Speed</span>
                  <div className="flex w-2/3 items-center gap-2">
                    <span className="text-xs text-gray-500">Slow</span>
                    <Slider
                      value={[animationSpeed]}
                      min={10}
                      max={100}
                      step={10}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">Fast</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="icon" disabled={!isAnimating}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled={isAnimating}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Center & Right Panels - Graph Visualization & Settings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="visualization" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualization">Graph Visualization</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="h-[calc(100%-40px)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex h-full flex-col gap-4"
              >
                <div className="flex-1 rounded-lg bg-gray-900 p-4">
                  <GraphVisualizer
                    image={image}
                    algorithm={algorithm}
                    isAnimating={isAnimating}
                    isEncrypted={isEncrypted}
                    animationSpeed={animationSpeed}
                  />
                </div>

                {showSettings && (
                  <div className="rounded-lg bg-gray-900 p-4">
                    <EncryptionSettings algorithm={algorithm} setAlgorithm={setAlgorithm} />
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="results" className="h-[calc(100%-40px)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-full rounded-lg bg-gray-900 p-4"
              >
                <ResultPanel originalImage={image} isEncrypted={isEncrypted} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
