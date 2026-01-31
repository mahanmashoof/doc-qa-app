This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Packages

### AI & Vector dependencies

npm install @anthropic-ai/sdk openai

### PDF processing

npm install pdf-parse

### Supabase client

npm install @supabase/supabase-js

### File upload UI

npm install react-dropzone

### Environment variables

npm install dotenv

## Supabase SQL editor (create db w vector support):

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE documents (
	id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	embedding VECTOR(1536),
	document_name TEXT,
	chunk_index INTEGER,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast similarity search
CREATE INDEX ON documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```
