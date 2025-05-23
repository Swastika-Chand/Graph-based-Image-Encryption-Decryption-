"use client"

import { useState } from "react"
import { Lock, Unlock, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ImageUploader from "@/components/image-uploader"
import GraphVisualizer from "@/components/graph-visualizer"

export default function ImageEncryptor() {
  const [image, setImage] = useState<string | null>(null)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [password, setPassword] = useState("")
  const [decryptPassword, setDecryptPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [encryptionPassword, setEncryptionPassword] = useState<string | null>(null)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setIsEncrypted(false)
    setEncryptionPassword(null)
    setPassword("")
    setDecryptPassword("")
    setPasswordError(null)
  }

  const handleEncrypt = () => {
    if (!image || !password.trim()) return

    setIsEncrypting(true)
    setPasswordError(null)

    // Simulate encryption process
    setTimeout(() => {
      setIsEncrypted(true)
      setIsEncrypting(false)
      setEncryptionPassword(password) // Store the password used for encryption
      setPassword("") // Clear the input field after encryption
    }, 1500)
  }

  const handleDecrypt = () => {
    if (!image || !isEncrypted) return

    // Check if password matches
    if (decryptPassword !== encryptionPassword) {
      setPasswordError("Incorrect password. Please try again.")
      return
    }

    setIsEncrypting(true)
    setPasswordError(null)

    // Simulate decryption process
    setTimeout(() => {
      setIsEncrypted(false)
      setIsEncrypting(false)
      setDecryptPassword("") // Clear the input field after decryption
    }, 1500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <section id="demo" className="py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Try It Yourself</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          Upload an image and see how our MST+DFS encryption algorithm works in real-time.
        </p>
      </div>

      <Card className="overflow-hidden border-gray-800 bg-gray-900/50 shadow-lg">
        <CardHeader className="border-b border-gray-800 bg-gray-900">
          <CardTitle className="text-xl text-cyan-400">Image Encryption Demo</CardTitle>
          <CardDescription>
            Upload an image, encrypt it using our graph-based algorithm, and visualize the process.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <h3 className="mb-4 text-lg font-medium text-cyan-400">Upload Image</h3>
                    <ImageUploader onImageUpload={handleImageUpload} currentImage={image} />
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <h3 className="mb-2 text-lg font-medium text-cyan-400">Security</h3>

                    {!isEncrypted ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm text-gray-400">
                            Set Encryption Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter a secure password"
                              className="border-gray-700 bg-gray-800 pr-10 text-white placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">You'll need this password to decrypt the image later.</p>
                        </div>

                        <Button
                          onClick={handleEncrypt}
                          disabled={!image || isEncrypting || !password.trim()}
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
                        >
                          <Lock className="mr-2 h-4 w-4" /> Encrypt Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="decryptPassword" className="text-sm text-gray-400">
                            Enter Decryption Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="decryptPassword"
                              type={showPassword ? "text" : "password"}
                              value={decryptPassword}
                              onChange={(e) => setDecryptPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="border-gray-700 bg-gray-800 pr-10 text-white placeholder:text-gray-500"
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {passwordError && (
                          <Alert variant="destructive" className="border-red-900 bg-red-950 text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{passwordError}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={handleDecrypt}
                          disabled={!image || isEncrypting || !decryptPassword.trim()}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          <Unlock className="mr-2 h-4 w-4" /> Decrypt Image
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <h3 className="mb-4 text-lg font-medium text-cyan-400">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Image:</span>
                        <span className="text-sm font-medium text-white">{image ? "Uploaded" : "Not uploaded"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Encryption:</span>
                        <span className={`text-sm font-medium ${isEncrypted ? "text-green-400" : "text-yellow-400"}`}>
                          {isEncrypted ? "Encrypted" : "Not encrypted"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Password Protection:</span>
                        <span
                          className={`text-sm font-medium ${encryptionPassword ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {encryptionPassword ? "Enabled" : "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Algorithm:</span>
                        <span className="text-sm font-medium text-cyan-400">MST+DFS</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-lg border border-gray-800 bg-gray-900 p-4">
                  <h3 className="mb-4 text-lg font-medium text-cyan-400">Result</h3>
                  {image ? (
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-gray-800 p-2">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Image preview"
                        className={`max-h-[300px] max-w-full rounded object-contain transition-all duration-500 ${
                          isEncrypted ? "blur-sm hue-rotate-180 saturate-150" : ""
                        }`}
                      />
                      {isEncrypting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-sm">
                          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-cyan-500"></div>
                          <p className="mt-4 text-sm font-medium text-cyan-400">
                            {isEncrypted ? "Decrypting..." : "Encrypting..."}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-800 bg-gray-800/50 p-12">
                      <div className="rounded-full bg-gray-800 p-3">
                        <ArrowRight className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="mt-4 text-center text-sm text-gray-500">Upload an image to see the result here</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="visualize" className="mt-6">
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                <h3 className="mb-4 text-lg font-medium text-cyan-400">MST+DFS Visualization</h3>
                <div className="h-[400px] w-full">
                  <GraphVisualizer image={image} isEncrypting={isEncrypting} isEncrypted={isEncrypted} />
                </div>
                <div className="mt-4 rounded-lg bg-gray-800 p-3">
                  <h4 className="mb-2 text-sm font-medium text-cyan-400">How the Algorithm Works</h4>
                  <ol className="ml-5 list-decimal space-y-1 text-sm text-gray-400">
                    <li>Creates a graph representation of the image with weighted edges</li>
                    <li>Finds the Minimum Spanning Tree (MST) using Kruskal's algorithm</li>
                    <li>Performs a Depth-First Search (DFS) traversal on the MST</li>
                    <li>Uses the traversal path to encrypt the image pixels</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
