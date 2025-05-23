import { Loader2 } from "lucide-react"

export default function LoadingUI() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      <h2 className="mt-4 text-xl font-light tracking-wider text-cyan-500">INITIALIZING ENCRYPTION ENGINE</h2>
    </div>
  )
}
