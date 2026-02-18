import { NextRequest, NextResponse } from "next/server";
import { searchDocuments } from "@/lib/documentSearch";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    console.log("💬 Question received:", question);

    // Search for relevant chunks
    const results = await searchDocuments(question, 3);

    if (results.length === 0) {
      return NextResponse.json({
        answer:
          "I couldn't find any relevant information in the document to answer that question.",
        sources: [],
      });
    }

    // Log what we found
    console.log("📊 Search results:");
    results.forEach((result, idx) => {
      console.log(
        `  ${idx + 1}. Similarity: ${result.similarity.toFixed(3)} - "${result.content.substring(0, 80)}..."`,
      );
    });

    // TODO: Chapter 11-13 - Send to Claude for actual answer
    // For now, just return the chunks
    return NextResponse.json({
      answer:
        "This is a placeholder. In Chapter 12, Claude will generate a real answer based on these chunks.",
      sources: results.map((r) => ({
        content: r.content,
        similarity: r.similarity,
      })),
    });
  } catch (error) {
    console.error("Chat error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to process question";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
