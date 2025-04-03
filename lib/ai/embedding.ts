import { db } from "@/lib/db";
import { embeddings } from "@/lib/db/schema/embeddings";
import { embed } from "ai";
import { desc, eq } from "drizzle-orm";
import { google } from "./models";

export const embeddingModel = google.textEmbeddingModel("text-embedding-004", {
  outputDimensionality: 768,
});

export const findRelevantContent = async (userQuery: string) => {
  const { embedding: userQueryEmbedding } = await embed({
    model: embeddingModel,
    value: userQuery,
  });

  // Just get all embeddings and filter in memory
  const allEmbeddings = await db.select().from(embeddings).limit(200).execute();

  // Calculate cosine similarity for each result
  const results = allEmbeddings.map((result) => {
    const resultEmbedding = result.embedding as number[];
    const similarity = calculateCosineSimilarity(
      userQueryEmbedding,
      resultEmbedding
    );
    return {
      name: result.content,
      similarity,
    };
  });

  // Sort by similarity and filter out low scores
  const sortedResults = results
    .filter((r) => r.similarity > 0.4)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 14);

  console.log({ topResults: sortedResults }); // TODO: Remove

  return sortedResults;
};

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }

  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);

  return dotProduct / (aMagnitude * bMagnitude);
}
