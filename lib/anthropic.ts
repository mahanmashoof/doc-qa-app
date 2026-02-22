import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper to build RAG prompt
export function buildRAGPrompt(question: string, context: string): string {
  return `You are a helpful assistant answering questions about a document.

Context from the document:
${context}

Question: ${question}

Instructions:
- Answer based ONLY on the information provided in the context above
- If the context doesn't contain enough information to answer, say so
- Be concise but complete
- Don't make up information that isn't in the context

Answer:`;
}

// Add new streaming function
export async function callClaudeStreaming(
  prompt: string,
): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true, // Enable streaming
        });

        // Iterate through the stream
        for await (const messageStreamEvent of stream) {
          // Only handle content block delta events with text
          if (
            messageStreamEvent.type === "content_block_delta" &&
            messageStreamEvent.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(messageStreamEvent.delta.text));
          }
        }

        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      }
    },
  });
}
