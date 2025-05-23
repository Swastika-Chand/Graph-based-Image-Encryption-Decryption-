import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Lock, Eye, BarChart, Fingerprint } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Key Features</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          Our graph-based encryption offers unique advantages over traditional methods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Shield className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Advanced Security</CardTitle>
            <CardDescription>Graph-theoretic approach to encryption</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            Our MST+DFS algorithm creates a complex encryption pattern that's extremely difficult to reverse-engineer
            without the exact graph structure and weights.
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Zap className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">High Performance</CardTitle>
            <CardDescription>Efficient encryption and decryption</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            Our optimized implementation of MST and DFS algorithms ensures fast processing even for large images, with
            minimal computational overhead.
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Eye className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Visual Verification</CardTitle>
            <CardDescription>See the encryption process in action</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            Our interactive visualization shows exactly how the MST+DFS algorithm works, providing transparency and
            educational value.
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Lock className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Lossless Encryption</CardTitle>
            <CardDescription>Perfect reconstruction on decryption</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            Unlike some encryption methods, our approach ensures that the decrypted image is pixel-perfect identical to
            the original, with no quality loss.
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <BarChart className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Statistical Resistance</CardTitle>
            <CardDescription>Resistant to statistical attacks</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            The graph-based approach disrupts pixel relationships and statistical patterns, making frequency analysis
            and other statistical attacks ineffective.
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Fingerprint className="mb-2 h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Unique Keys</CardTitle>
            <CardDescription>Every encryption uses a unique graph</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-400">
            Each encryption generates a unique graph with random edge weights, ensuring that even the same image
            encrypted twice will have different patterns.
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
