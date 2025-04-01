import { db } from "@/lib/db";
import { embeddings } from "@/lib/db/schema/embeddings";
import { embed } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { google } from "./models";

export const embeddingModel = google.textEmbeddingModel("text-embedding-004", {
  outputDimensionality: 768,
});

export const findRelevantContent = async (userQuery: string) => {
  const { embedding: userQueryEmbedding } = await embed({
    model: embeddingModel,
    value: userQuery,
  });

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedding
  )})`;

  // Set ef_search parameter for maximum accuracy with HNSW (disregarding performance)
  await db.execute(sql`SET hnsw.ef_search = 500;`);

  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.4)) // Slightly lower threshold for better recall
    .orderBy((t) => desc(t.similarity))
    .limit(200) // Retrieve more candidates initially
    .execute();

  // Take top 14 with highest confidence
  const topResults = similarGuides.slice(0, 14);

  console.log({ topResults }); // TODO: Remove

  return topResults;
};
