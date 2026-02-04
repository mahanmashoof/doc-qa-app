import { extractText } from "unpdf";

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert File to Uint8Array (what unpdf expects)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Extract text from PDF
    const { text, totalPages } = await extractText(uint8Array, {
      mergePages: true, // Combine all pages into one string
    });

    if (!text || text.trim().length === 0) {
      throw new Error("No text found in PDF. It might be scanned/image-based.");
    }

    console.log("📄 PDF parsed successfully:", {
      pages: totalPages,
      textLength: text.length,
      preview: text.substring(0, 200) + "...",
    });

    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
