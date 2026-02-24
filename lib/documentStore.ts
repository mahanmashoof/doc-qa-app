import { supabase } from "./supabase";
import { generateEmbedding } from "./openai";
import type { DocumentChunk } from "./supabase";

export async function storeDocumentChunks(
  chunks: Array<{ content: string; index: number }>,
  documentName: string,
): Promise<void> {
  console.log(`💾 Storing ${chunks.length} chunks for "${documentName}"...`);

  // Clear ALL existing documents
  console.log("🗑️ Clearing all existing documents...");
  const { data: allDocs } = await supabase.from("documents").select("id");

  if (allDocs && allDocs.length > 0) {
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .in(
        "id",
        allDocs.map((doc) => doc.id),
      );

    if (deleteError) {
      console.error("Error deleting old chunks:", deleteError);
      throw new Error("Failed to clear old document data");
    }

    console.log(`✅ Cleared ${allDocs.length} old chunks`);
  }

  // Process chunks one by one
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    console.log(`  Processing chunk ${i + 1}/${chunks.length}...`);

    // Generate embedding for this chunk
    const embedding = await generateEmbedding(chunk.content);

    // Prepare data for Supabase
    const documentChunk: Omit<DocumentChunk, "id" | "created_at"> = {
      content: chunk.content,
      embedding: embedding,
      document_name: documentName,
      chunk_index: chunk.index,
    };

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from("documents")
      .insert(documentChunk);

    if (insertError) {
      console.error("Error inserting chunk:", insertError);
      throw new Error(`Failed to store chunk ${i + 1}`);
    }
  }

  console.log(`✅ Successfully stored ${chunks.length} chunks!`);
}
