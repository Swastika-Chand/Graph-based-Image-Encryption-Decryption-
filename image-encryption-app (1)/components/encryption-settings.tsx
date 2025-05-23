"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

interface EncryptionSettingsProps {
  algorithm: "dfs" | "bfs"
  setAlgorithm: (algorithm: "dfs" | "bfs") => void
}

export default function EncryptionSettings({ algorithm, setAlgorithm }: EncryptionSettingsProps) {
  const [complexity, setComplexity] = useState(50)
  const [useEdgeWeights, setUseEdgeWeights] = useState(true)
  const [useColorChannels, setUseColorChannels] = useState(true)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-cyan-400">Encryption Settings</h2>

      <Accordion type="single" collapsible defaultValue="algorithm">
        <AccordionItem value="algorithm" className="border-gray-800">
          <AccordionTrigger className="text-sm font-medium text-gray-300 hover:text-white">
            Graph Algorithm
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={algorithm}
              onValueChange={(value) => setAlgorithm(value as "dfs" | "bfs")}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dfs" id="dfs" />
                <Label htmlFor="dfs" className="cursor-pointer text-sm font-normal">
                  Depth-First Search (DFS)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bfs" id="bfs" />
                <Label htmlFor="bfs" className="cursor-pointer text-sm font-normal">
                  Breadth-First Search (BFS)
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-3 text-xs text-gray-500">
              {algorithm === "dfs" ? (
                <p>
                  DFS explores as far as possible along each branch before backtracking, creating a more complex
                  encryption pattern.
                </p>
              ) : (
                <p>
                  BFS explores all neighbors at the present depth before moving to nodes at the next depth level,
                  creating a more uniform encryption pattern.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="complexity" className="border-gray-800">
          <AccordionTrigger className="text-sm font-medium text-gray-300 hover:text-white">
            Graph Complexity
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="complexity" className="text-sm font-normal">
                    Node Density
                  </Label>
                  <span className="text-xs text-gray-500">{complexity}%</span>
                </div>
                <Slider
                  id="complexity"
                  value={[complexity]}
                  min={10}
                  max={100}
                  step={10}
                  onValueChange={(value) => setComplexity(value[0])}
                />
                <p className="text-xs text-gray-500">
                  Higher density creates more complex encryption but requires more processing power.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border-gray-800">
          <AccordionTrigger className="text-sm font-medium text-gray-300 hover:text-white">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edge-weights" className="text-sm font-normal">
                    Use Edge Weights
                  </Label>
                  <p className="text-xs text-gray-500">Apply weighted edges for more complex encryption</p>
                </div>
                <Switch id="edge-weights" checked={useEdgeWeights} onCheckedChange={setUseEdgeWeights} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="color-channels" className="text-sm font-normal">
                    Process Color Channels
                  </Label>
                  <p className="text-xs text-gray-500">Apply different graph patterns to each RGB channel</p>
                </div>
                <Switch id="color-channels" checked={useColorChannels} onCheckedChange={setUseColorChannels} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
