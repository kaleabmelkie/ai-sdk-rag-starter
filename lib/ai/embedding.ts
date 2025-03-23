import { db } from "@/lib/db";
import { embeddings } from "@/lib/db/schema/embeddings";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

export const embeddingModel = openai.textEmbeddingModel(
  "text-embedding-3-large",
  {
    dimensions: 2000,
  }
);

export const findRelevantContent = async (userQuery: string) => {
  const { embedding: userQueryEmbedding } = await embed({
    model: embeddingModel,
    value: userQuery,
  });

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedding
  )})`;

  // Set probes parameter for higher accuracy
  await db.execute(sql`SET ivfflat.probes = 100;`);

  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.4)) // Slightly lower threshold for better recall
    .orderBy((t) => desc(t.similarity))
    .limit(200) // Retrieve more candidates initially
    .execute();

  // Take top 4 with highest confidence
  const topResults = similarGuides.slice(0, 10);

  console.log({ topResults }); // TODO: Remove

  return topResults;
};
