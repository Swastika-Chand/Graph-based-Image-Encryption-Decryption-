"use client"

import { useState } from "react"
import { Menu, X, Lock, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Lock className="mr-2 h-6 w-6 text-cyan-500" />
          <span className="text-xl font-bold tracking-tight text-white">CryptoGraph</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <a href="#demo" className="text-sm font-medium text-gray-300 transition hover:text-cyan-400">
            Try It
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-300 transition hover:text-cyan-400">
            How It Works
          </a>
          <a href="#features" className="text-sm font-medium text-gray-300 transition hover:text-cyan-400">
            Features
          </a>
          <a href="#faq" className="text-sm font-medium text-gray-300 transition hover:text-cyan-400">
            FAQ
          </a>
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <Button className="bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
        </div>

        {/* Mobile menu button */}
        <button className="rounded-md p-2 text-gray-400 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-b border-gray-800 bg-gray-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <a
              href="#demo"
              className="text-base font-medium text-gray-300 transition hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Try It
            </a>
            <a
              href="#how-it-works"
              className="text-base font-medium text-gray-300 transition hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-base font-medium text-gray-300 transition hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-base font-medium text-gray-300 transition hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
