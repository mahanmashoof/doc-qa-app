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
    if (
      confirm(
        "Are you sure you want to upload a new document? This will clear the current chat.",
      )
    ) {
      setDocumentLoaded(false);
      setDocumentName("");
    }
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
          {documentLoaded && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Document loaded</span>
            </div>
          )}
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
