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

// Helper with retry logic
export async function callClaudeWithRetry(
  prompt: string,
  maxRetries: number = 3,
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Calling Claude (attempt ${attempt}/${maxRetries})...`);

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307", // Use latest stable Sonnet 3.5
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const answer =
        message.content[0].type === "text"
          ? message.content[0].text
          : "Unable to generate answer";

      return answer;
    } catch (error: unknown) {
      const isOverloaded =
        error instanceof Error &&
        "status" in error &&
        (error as { status: number }).status === 529;
      const isLastAttempt = attempt === maxRetries;

      if (isOverloaded && !isLastAttempt) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff
        console.log(`⏳ API overloaded, waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // If not overloaded or last attempt, throw
      throw error;
    }
  }

  throw new Error("Failed to get response from Claude after retries");
}
