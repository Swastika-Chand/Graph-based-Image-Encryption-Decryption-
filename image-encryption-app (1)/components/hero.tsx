import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-950 py-16 sm:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0891b2,transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Secure Image Encryption with Graph Theory
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-gray-300">
              Advanced encryption using Minimum Spanning Tree and Depth-First Search algorithms to protect your visual
              data.
            </p>
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Try It Now
              </Button>
              <Button size="lg" variant="outline" className="group border-gray-700 text-gray-300 hover:bg-gray-800">
                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] rounded-full bg-cyan-500/10 p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full fill-none stroke-cyan-500/40"
                  strokeWidth="1"
                >
                  <path d="M 30,40 L 100,40 L 170,40 L 170,100 L 170,160 L 100,160 L 30,160 L 30,100 Z" />
                  <circle cx="30" cy="40" r="5" className="fill-cyan-500" />
                  <circle cx="100" cy="40" r="5" className="fill-cyan-500" />
                  <circle cx="170" cy="40" r="5" className="fill-cyan-500" />
                  <circle cx="30" cy="100" r="5" className="fill-cyan-500" />
                  <circle cx="100" cy="100" r="5" className="fill-cyan-500" />
                  <circle cx="170" cy="100" r="5" className="fill-cyan-500" />
                  <circle cx="30" cy="160" r="5" className="fill-cyan-500" />
                  <circle cx="100" cy="160" r="5" className="fill-cyan-500" />
                  <circle cx="170" cy="160" r="5" className="fill-cyan-500" />
                  <path d="M 30,40 L 100,40" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 100,40 L 170,40" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 30,40 L 30,100" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 30,100 L 30,160" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 30,160 L 100,160" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 100,160 L 170,160" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 170,100 L 170,160" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 170,40 L 170,100" className="stroke-cyan-500" strokeWidth="2" />
                  <path d="M 30,40 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 100,40 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 170,40 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 30,100 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 100,100 L 170,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 30,160 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 100,160 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M 170,160 L 100,100" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-cyan-500/5 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
