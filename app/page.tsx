"use client";

import { useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const handleDocumentUpload = (fileName: string) => {
    setDocumentName(fileName);
    setDocumentLoaded(true);
  };

  const handleReset = () => {
    setDocumentLoaded(false);
    setDocumentName("");
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Document Q&A Assistant
          </h1>
          <p className="text-gray-600">
            Upload a PDF and ask questions about its content
          </p>
        </header>

        {!documentLoaded ? (
          <DocumentUpload onUploadComplete={handleDocumentUpload} />
        ) : (
          <ChatInterface documentName={documentName} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
