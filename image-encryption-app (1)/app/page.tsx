import Header from "@/components/header"
import Hero from "@/components/hero"
import ImageEncryptor from "@/components/image-encryptor"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Header />
      <main>
        <Hero />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <ImageEncryptor />
          <HowItWorks />
          <Features />
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  )
}
