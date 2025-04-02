import { waterLaw } from "@/lib/ai/et-laws/data/water-law";
import { generateEmbeddingsForEtLaws } from "@/lib/ai/et-laws/generate-embeddings-for-et-laws";
import { db } from "@/lib/db";
import { embeddings as embeddingsTable } from "@/lib/db/schema/embeddings";
import { resources } from "@/lib/db/schema/resources";

async function main() {
  const embeddings = await generateEmbeddingsForEtLaws(waterLaw);
  const content = embeddings.map((e) => e.content).join("\n");

  console.log({
    embeddingsCount: embeddings.length,
    contentLength: content.length,
  });

  const [resource] = await db.insert(resources).values({ content }).returning();

  await db.insert(embeddingsTable).values(
    embeddings.map((embedding) => ({
      resourceId: resource.id,
      ...embedding,
    }))
  );
}

main()
  .then(() => {
    console.info("Done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
