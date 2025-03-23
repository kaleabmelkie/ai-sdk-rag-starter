import { embeddingModel } from "@/lib/ai/embedding";
import { embedMany } from "ai";

export async function generateEmbeddingsForDocs(
  value: string
): Promise<{ embedding: number[]; content: string }[]> {
  const chunks = generateChunksForDocs(value);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}

// Enhanced chunking strategy for code documentation
function generateChunksForDocs(
  input: string,
  options = {
    chunkSize: 200,
    chunkOverlap: 20,
    respectCodeStructure: true,
  }
): string[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  const { chunkSize, chunkOverlap, respectCodeStructure } = options;

  // If we should respect code structure, try to split on meaningful boundaries
  if (respectCodeStructure) {
    // Split by common code structure markers
    const structuralChunks = splitByCodeStructure(input);

    // If we got meaningful structural chunks, use them
    if (structuralChunks.length > 1) {
      // Further process each structural chunk if they're too large
      return structuralChunks.flatMap((chunk) =>
        chunk.length > chunkSize * 1.5
          ? createOverlappingChunks(chunk, chunkSize, chunkOverlap)
          : [chunk]
      );
    }
  }

  // Fall back to overlapping chunks if no structural boundaries found
  return createOverlappingChunks(input, chunkSize, chunkOverlap);
}

// Helper function to split by GraphQL code structure
function splitByCodeStructure(input: string): string[] {
  // Split on common GraphQL structure patterns
  const patterns = [
    // GraphQL type definitions
    /^type\s+\w+/gm,
    // GraphQL interface definitions
    /^interface\s+\w+/gm,
    // GraphQL input type definitions
    /^input\s+\w+/gm,
    // GraphQL enum definitions
    /^enum\s+\w+/gm,
    // GraphQL union definitions
    /^union\s+\w+/gm,
    // GraphQL scalar definitions
    /^scalar\s+\w+/gm,
    // GraphQL schema definition
    /^schema\s*{/gm,
    // GraphQL query definitions
    /^(type\s+)?Query\s*{/gm,
    // GraphQL mutation definitions
    /^(type\s+)?Mutation\s*{/gm,
    // GraphQL subscription definitions
    /^(type\s+)?Subscription\s*{/gm,
    // GraphQL directives
    /^directive\s+@\w+/gm,
    // GraphQL fragments
    /^fragment\s+\w+\s+on\s+\w+/gm,
    // GraphQL operations (queries, mutations)
    /^(query|mutation|subscription)\s+\w+/gm,
    // GraphQL comments
    /^#.*$/gm,
    // JavaScript/TypeScript resolver functions
    /^(const|let|var|function)\s+\w+Resolver\s*=/gm,
    // Apollo Server setup
    /^(const|let|var)\s+(server|apolloServer)\s*=/gm,
    // GraphQL schema imports/requires
    /^(import|const)\s+.*\b(gql|graphql)\b/gm,
    // Markdown headers for documentation
    /^#{1,6}\s+/gm,
  ];

  // Find all potential split points
  const splitPoints: number[] = [];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(input)) !== null) {
      if (match.index > 0) {
        splitPoints.push(match.index);
      }
    }
  });

  // Add start and end points
  splitPoints.sort((a, b) => a - b);
  splitPoints.unshift(0);
  splitPoints.push(input.length);

  // Create chunks based on split points
  const chunks: string[] = [];
  for (let i = 0; i < splitPoints.length - 1; i++) {
    const chunk = input.substring(splitPoints[i], splitPoints[i + 1]).trim();
    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

// Helper function to create overlapping chunks of specified size
function createOverlappingChunks(
  text: string,
  chunkSize: number,
  chunkOverlap: number
): string[] {
  const chunks: string[] = [];

  // Split by newlines first to preserve some structure
  const lines = text.split("\n");

  let currentChunk = "";

  for (const line of lines) {
    // If adding this line would exceed chunk size, store current chunk and start new one
    if (
      currentChunk.length + line.length > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk);

      // Start new chunk with overlap from previous chunk
      const words = currentChunk.split(" ");
      const overlapWordCount = Math.min(
        Math.ceil(words.length * (chunkOverlap / currentChunk.length)),
        words.length - 1
      );

      currentChunk = words.slice(-overlapWordCount).join(" ");

      // Add a marker to indicate continuation
      if (currentChunk.length > 0) {
        currentChunk += " ";
      }
    }

    currentChunk += (currentChunk.length > 0 ? "\n" : "") + line;
  }

  // Add the last chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}
