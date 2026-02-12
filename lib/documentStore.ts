import { supabase } from "./supabase";
import { generateEmbedding } from "./openai";
import type { DocumentChunk } from "./supabase";

interface IProps {
  chunks: { content: string; index: number }[];
  documentName: string;
}

export async function storeDocumentChunks(props: IProps): Promise<void> {
  console.log(
    `💾 Storing ${props.chunks.length} chunks for "${props.documentName}"...`,
  );

  // Clear any existing chunks for this document (in case of re-upload)
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("document_name", props.documentName);

  if (deleteError) {
    console.error("Error deleting old chunks:", deleteError);
    throw new Error("Failed to clear old document data");
  }

  // Process chunks one by one (we could batch this, but keeping it simple)
  for (let i = 0; i < props.chunks.length; i++) {
    const chunk = props.chunks[i];
    console.log(`  Processing chunk ${i + 1}/${props.chunks.length}...`);

    // Generate embedding for this chunk
    const embedding = await generateEmbedding(chunk.content);

    // Prepare data for Supabase
    const documentChunk: Omit<DocumentChunk, "id" | "created_at"> = {
      content: chunk.content,
      embedding: embedding,
      document_name: props.documentName,
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

  console.log(`✅ Successfully stored ${props.chunks.length} chunks!`);
}
