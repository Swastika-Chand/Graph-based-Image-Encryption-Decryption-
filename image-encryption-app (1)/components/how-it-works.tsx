import { Card, CardContent } from "@/components/ui/card"
import { Network, GitGraph, Lock, Fingerprint, Key } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How It Works</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          Our encryption process uses advanced graph theory algorithms to secure your images.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-cyan-500/10 p-3">
              <Key className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Password Protection</h3>
            <p className="text-sm text-gray-400">
              Your password adds an additional layer of security by seeding the encryption algorithm.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-cyan-500/10 p-3">
              <Network className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Graph Creation</h3>
            <p className="text-sm text-gray-400">
              The image is represented as a grid of nodes with weighted edges connecting adjacent pixels.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-cyan-500/10 p-3">
              <GitGraph className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">MST Algorithm</h3>
            <p className="text-sm text-gray-400">
              Kruskal's algorithm finds the Minimum Spanning Tree, connecting all pixels with minimal total weight.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-cyan-500/10 p-3">
              <svg
                className="h-6 w-6 text-cyan-500"
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
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                <path d="M11 18H8a2 2 0 0 1-2-2V9" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">DFS Traversal</h3>
            <p className="text-sm text-gray-400">
              A Depth-First Search traversal of the MST creates a unique path through all pixels of the image.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-cyan-500/10 p-3">
              <Lock className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Pixel Encryption</h3>
            <p className="text-sm text-gray-400">
              The DFS path determines how pixels are transformed, creating a secure encryption pattern.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <div className="flex items-center">
          <Fingerprint className="mr-3 h-6 w-6 text-cyan-500" />
          <h3 className="text-lg font-medium text-white">Multi-Layer Security</h3>
        </div>
        <p className="mt-2 text-gray-400">
          Our approach combines password protection with MST+DFS graph algorithms. Your password influences the graph
          structure and edge weights, creating a unique encryption key. Without both the correct password and knowledge
          of the algorithm implementation, it's computationally infeasible to decrypt the image.
        </p>
      </div>
    </section>
  )
}
