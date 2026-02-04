import { extractTextFromPDF } from "@/lib/pdfUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 },
      );
    }

    console.log("✅ File received:", file.name);

    // extract text
    const text = await extractTextFromPDF(file);
    console.log("✅ Text extracted:", {
      length: text.length,
      wordCount: text.split(/\s+/).length,
    });
    // TODO: In Chapter 6, we'll chunk it
    // TODO: In Chapters 7-9, we'll create embeddings and store them

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "File received successfully",
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to process pdf";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
