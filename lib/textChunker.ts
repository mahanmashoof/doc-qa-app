interface TextChunk {
  content: string;
  index: number;
  wordCount: number;
}

export function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50,
): TextChunk[] {
  // Split text into words
  const words = text.split(/\s+/).filter((word) => word.length > 0);

  if (words.length === 0) {
    return [];
  }

  const chunks: TextChunk[] = [];
  let startIndex = 0;

  while (startIndex < words.length) {
    // Get chunk of words
    const chunkWords = words.slice(startIndex, startIndex + chunkSize);
    const chunkContent = chunkWords.join(" ");

    chunks.push({
      content: chunkContent,
      index: chunks.length,
      wordCount: chunkWords.length,
    });

    // Move forward, accounting for overlap
    // If this is the last chunk, break
    if (startIndex + chunkSize >= words.length) {
      break;
    }

    // Move to next chunk position (with overlap)
    startIndex += chunkSize - overlap;
  }

  console.log(`📝 Created ${chunks.length} chunks from ${words.length} words`);

  return chunks;
}
