import { NextRequest } from "next/server";
import { searchDocuments } from "@/lib/documentSearch";
import { buildRAGPrompt, callClaudeStreaming } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("💬 Question received:", question);

    // Search for relevant chunks
    const results = await searchDocuments(question, 3);

    if (results.length === 0) {
      return new Response(
        "I couldn't find any relevant information in the document to answer that question.",
        { headers: { "Content-Type": "text/plain" } },
      );
    }

    // Log what we found
    console.log("📊 Search results:");
    results.forEach((result, idx) => {
      console.log(
        `  ${idx + 1}. Similarity: ${result.similarity.toFixed(3)} - "${result.content.substring(0, 80)}..."`,
      );
    });

    // Combine chunks into context
    const context = results
      .map((r, idx) => `[Chunk ${idx + 1}]:\n${r.content}`)
      .join("\n\n");

    // Build prompt
    const prompt = buildRAGPrompt(question, context);

    console.log("🤖 Streaming response from Claude...");

    // Get streaming response
    const stream = await callClaudeStreaming(prompt);

    // Return JUST the stream, not wrapped in JSON
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to process question";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
