import { Lock, Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              <Lock className="mr-2 h-6 w-6 text-cyan-500" />
              <span className="text-xl font-bold tracking-tight text-white">CryptoGraph</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Advanced image encryption using graph theory algorithms for maximum security and performance.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 transition hover:text-cyan-500">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-cyan-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-cyan-500">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Research Papers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 transition hover:text-cyan-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CryptoGraph. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
