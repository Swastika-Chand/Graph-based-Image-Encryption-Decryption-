"use client"

import { useEffect, useState } from "react"
import ReactFlow, { Background, Controls, type Node, type Edge, MarkerType } from "reactflow"
import "reactflow/dist/style.css"
import { Loader2, ImageIcon } from "lucide-react"

interface GraphVisualizerProps {
  image: string | null
  isEncrypting: boolean
  isEncrypted: boolean
}

// Edge with weight for MST algorithm
interface WeightedEdge {
  id: string
  source: string
  target: string
  weight: number
}

export default function GraphVisualizer({ image, isEncrypting, isEncrypted }: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [mstEdges, setMstEdges] = useState<Set<string>>(new Set())
  const [dfsPath, setDfsPath] = useState<string[]>([])

  // Generate graph based on image
  useEffect(() => {
    if (!image) {
      setNodes([])
      setEdges([])
      setMstEdges(new Set())
      setDfsPath([])
      return
    }

    // Generate a sample graph for visualization
    const gridSize = 5 // Slightly larger grid for better visualization
    const newNodes: Node[] = []
    const newEdges: Edge[] = []
    const weightedEdges: WeightedEdge[] = []

    // Create nodes in a grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const id = `${x}-${y}`
        newNodes.push({
          id,
          data: { label: id },
          position: {
            x: 80 + x * 80,
            y: 50 + y * 80,
          },
          style: {
            background: "#1e293b",
            color: "#94a3b8",
            border: "1px solid #334155",
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            transition: "all 0.3s ease",
          },
        })

        // Create edges with random weights
        if (x > 0) {
          const weight = Math.floor(Math.random() * 9) + 1
          const edgeId = `${x - 1}-${y}-to-${x}-${y}`
          newEdges.push({
            id: edgeId,
            source: `${x - 1}-${y}`,
            target: id,
            label: weight.toString(),
            style: { stroke: "#475569", transition: "all 0.3s ease" },
            labelStyle: { fill: "#94a3b8", fontSize: 10 },
            markerEnd: {
              type: MarkerType.Arrow,
              color: "#475569",
            },
          })
          weightedEdges.push({
            id: edgeId,
            source: `${x - 1}-${y}`,
            target: id,
            weight,
          })
        }

        if (y > 0) {
          const weight = Math.floor(Math.random() * 9) + 1
          const edgeId = `${x}-${y - 1}-to-${x}-${y}`
          newEdges.push({
            id: edgeId,
            source: `${x}-${y - 1}`,
            target: id,
            label: weight.toString(),
            style: { stroke: "#475569", transition: "all 0.3s ease" },
            labelStyle: { fill: "#94a3b8", fontSize: 10 },
            markerEnd: {
              type: MarkerType.Arrow,
              color: "#475569",
            },
          })
          weightedEdges.push({
            id: edgeId,
            source: `${x}-${y - 1}`,
            target: id,
            weight,
          })
        }
      }
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [image])

  // Run MST + DFS when encrypting
  useEffect(() => {
    if (isEncrypting && nodes.length > 0 && edges.length > 0) {
      // Step 1: Find MST using Kruskal's algorithm
      const findMST = () => {
        // Extract weighted edges from the graph
        const weightedEdges: WeightedEdge[] = edges.map((edge) => ({
          id: edge.id,
          source: edge.source as string,
          target: edge.target as string,
          weight: Number.parseInt(edge.label as string) || 1,
        }))

        // Sort edges by weight
        weightedEdges.sort((a, b) => a.weight - b.weight)

        // Disjoint Set data structure for cycle detection
        const parent: Record<string, string> = {}
        const rank: Record<string, number> = {}

        // Initialize disjoint set
        nodes.forEach((node) => {
          parent[node.id] = node.id
          rank[node.id] = 0
        })

        // Find operation with path compression
        const find = (x: string): string => {
          if (parent[x] !== x) {
            parent[x] = find(parent[x])
          }
          return parent[x]
        }

        // Union operation with rank
        const union = (x: string, y: string): void => {
          const rootX = find(x)
          const rootY = find(y)

          if (rootX === rootY) return

          if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY
          } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX
          } else {
            parent[rootY] = rootX
            rank[rootX]++
          }
        }

        // Build MST
        const mst: Set<string> = new Set()
        const mstAdjList: Record<string, string[]> = {}

        // Initialize adjacency list for DFS
        nodes.forEach((node) => {
          mstAdjList[node.id] = []
        })

        for (const edge of weightedEdges) {
          const { id, source, target } = edge

          if (find(source) !== find(target)) {
            mst.add(id)
            union(source, target)

            // Add to adjacency list (undirected)
            mstAdjList[source].push(target)
            mstAdjList[target].push(source)
          }
        }

        return { mst, mstAdjList }
      }

      // Step 2: Perform DFS on the MST
      const performDFS = (mstAdjList: Record<string, string[]>) => {
        const startNode = "0-0" // Start from top-left
        const visited: Set<string> = new Set()
        const path: string[] = []

        const dfs = (node: string) => {
          visited.add(node)
          path.push(node)

          for (const neighbor of mstAdjList[node]) {
            if (!visited.has(neighbor)) {
              dfs(neighbor)
            }
          }
        }

        dfs(startNode)
        return path
      }

      // Execute MST + DFS
      const { mst, mstAdjList } = findMST()
      const dfsPath = performDFS(mstAdjList)

      setMstEdges(mst)
      setDfsPath(dfsPath)
    }
  }, [isEncrypting, nodes, edges])

  // Update node and edge styles based on MST and DFS path
  useEffect(() => {
    if (mstEdges.size === 0 || dfsPath.length === 0 || !isEncrypted) return

    // Update nodes based on DFS path
    setNodes(
      nodes.map((node) => {
        const dfsIndex = dfsPath.indexOf(node.id)
        const isInPath = dfsIndex !== -1

        return {
          ...node,
          style: {
            ...node.style,
            background: isInPath ? `hsl(${180 + (dfsIndex * 150) / dfsPath.length}, 70%, 45%)` : "#1e293b",
            color: isInPath ? "#ffffff" : "#94a3b8",
            border: isInPath ? "2px solid #22d3ee" : "1px solid #334155",
            boxShadow: isInPath ? "0 0 10px rgba(34, 211, 238, 0.3)" : "none",
          },
        }
      }),
    )

    // Update edges based on MST
    setEdges(
      edges.map((edge) => {
        const isInMST = mstEdges.has(edge.id)
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isInMST ? "#06b6d4" : "#475569",
            strokeWidth: isInMST ? 3 : 1,
          },
          labelStyle: {
            ...edge.labelStyle,
            fill: isInMST ? "#06b6d4" : "#94a3b8",
            fontWeight: isInMST ? "bold" : "normal",
          },
          markerEnd: {
            ...edge.markerEnd,
            color: isInMST ? "#06b6d4" : "#475569",
          },
        }
      }),
    )
  }, [mstEdges, dfsPath, isEncrypted, nodes, edges])

  if (!image) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800 bg-gray-900/50">
        <ImageIcon className="mb-2 h-10 w-10 text-gray-500" />
        <p className="text-sm text-gray-400">Upload an image to visualize encryption</p>
      </div>
    )
  }

  if (isEncrypting) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          <h3 className="mt-4 text-sm font-medium text-cyan-400">Encrypting with MST+DFS</h3>
        </div>

        <div className="h-full w-full">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#1e293b" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#1e293b" gap={16} />
        <Controls />
      </ReactFlow>

      {isEncrypted && (
        <div className="mt-4 rounded-lg bg-gray-800 p-3">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-cyan-500"></div>
            <p className="text-xs text-cyan-400">MST Edges (Minimum Spanning Tree)</p>
          </div>
          <div className="mt-1 flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <p className="text-xs text-cyan-400">DFS Path (Depth-First Search Traversal)</p>
          </div>
        </div>
      )}
    </div>
  )
}
