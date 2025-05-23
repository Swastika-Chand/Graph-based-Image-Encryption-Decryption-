import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section id="faq" className="py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          Common questions about our graph-based image encryption.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              What is MST+DFS encryption?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              MST+DFS encryption is a graph-based approach that uses a Minimum Spanning Tree (MST) algorithm to create a
              connected graph with minimal total edge weight, followed by a Depth-First Search (DFS) traversal to
              determine the encryption path. This creates a unique pattern for transforming image pixels that's
              extremely difficult to reverse without knowing the exact graph structure.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              How secure is this compared to traditional encryption?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Our graph-based encryption offers comparable security to traditional methods but with unique advantages.
              The security comes from the complexity of the graph structure and the unpredictability of the MST+DFS
              path. Without knowing the exact graph weights and structure, an attacker would need to try an astronomical
              number of combinations to decrypt the image.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              Can I encrypt any type of image?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Yes, our algorithm works with any standard image format (JPEG, PNG, GIF, etc.) and preserves the original
              quality. The encryption process treats the image as a grid of pixels, so it's format-agnostic. For best
              results, we recommend using lossless formats like PNG for the encrypted output.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              How is the encryption key generated and stored?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              The encryption key consists of the graph structure (node connections) and the edge weights. This key is
              generated randomly for each encryption process. In a production environment, this key would be securely
              stored and transmitted using standard cryptographic protocols. The same key is required for decryption.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              Is there any performance impact for large images?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Our implementation is optimized for efficiency, but very large images (e.g., high-resolution photos) will
              naturally take longer to process. The time complexity is approximately O(n log n) where n is the number of
              pixels. For most common image sizes, the encryption and decryption process completes in seconds.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              Can this be used for video encryption?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              While our current implementation focuses on still images, the same principles can be extended to video
              encryption by treating each frame as a separate image or by creating a 3D graph that includes temporal
              connections between frames. This is an area of ongoing development in our research.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7" className="border-gray-800">
            <AccordionTrigger className="text-left text-white hover:text-cyan-400">
              How does the password protection work?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              The password you provide is used as a seed for the graph generation algorithm, influencing both the edge
              weights and the structure of the Minimum Spanning Tree. This means that even if someone has access to the
              encrypted image, they cannot decrypt it without knowing both the password and the exact implementation of
              our algorithm. The password essentially creates a unique encryption key specific to your image.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
