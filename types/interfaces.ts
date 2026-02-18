export interface SearchResult {
  content: string;
  similarity: number;
  chunk_index: number;
  document_name: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInterfaceProps {
  documentName: string;
  onReset: () => void;
}
