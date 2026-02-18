import { supabase } from "./supabase";
import { generateEmbedding } from "./openai";
import { SearchResult } from "@/types/interfaces";

export async function searchDocuments(
  query: string,
  topK: number = 3,
): Promise<SearchResult[]> {
  console.log(`🔍 Searching for: "${query}"`);

  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  console.log("Calling match_documents...");

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: vectorString,
    match_count: topK,
  });

  console.log("Result:", {
    hasData: !!data,
    length: data?.length,
    firstResult: data?.[0]?.similarity,
  });

  if (error) {
    console.error("❌ Search error:", error);
    throw new Error("Failed to search documents");
  }

  console.log(`✅ Found ${data?.length || 0} chunks`);
  return data || [];
}
