import { embeddingModel } from "@/lib/ai/embedding";
import {
  EtLawsChunk,
  EtLawsSection,
  EtLawsSubsection,
} from "@/lib/types/et-laws-chunk";
import { embedMany } from "ai";
import { db } from "@/lib/db";
import { embeddings } from "@/lib/db/schema/embeddings";

export async function generateEmbeddingsForEtLaws(
  data: EtLawsChunk[]
): Promise<{ embedding: number[]; content: string }[]> {
  const chunks: string[] = [];

  // Process each law chunk (part)
  data.forEach((part) => {
    // Process each section in the part
    part.sections.forEach((section) => {
      // Create a chunk with part, section title and content
      const mainChunk = `Part ${part.number}: ${part.title} - Section ${section.number}: ${section.title}\n${section.content}`;
      chunks.push(mainChunk);

      // Process subsections recursively
      if (section.subsections && section.subsections.length > 0) {
        processSubsections(
          section.subsections,
          chunks,
          `Part ${part.number}: ${part.title} - Section ${section.number}: ${section.title}`
        );
      }
    });
  });

  // Process in batches of 100
  const results: { content: string; embedding: number[] }[] = [];

  for (let i = 0; i < chunks.length; i += 100) {
    const batch = chunks.slice(i, i + 100);
    console.log(
      `Processing batch ${Math.floor(i / 100) + 1} of ${Math.ceil(
        chunks.length / 100
      )}`
    );

    const embeddingsResult = await embedMany({
      model: embeddingModel,
      values: batch,
    });

    // Add each result to our results array
    for (let j = 0; j < batch.length; j++) {
      results.push({
        content: batch[j],
        embedding: embeddingsResult.embeddings[j],
      });
    }

    console.log(`Completed batch ${Math.floor(i / 100) + 1}`);
  }

  console.log(`Successfully generated ${results.length} embeddings`);
  return results;
}

// Helper function to process subsections recursively
function processSubsections(
  subsections: EtLawsSubsection[],
  chunks: string[],
  parentContext: string
): void {
  subsections.forEach((subsection) => {
    // Create a chunk with parent context and current subsection
    const subsectionChunk = `${parentContext}\nSubsection ${subsection.number}: ${subsection.content}`;
    chunks.push(subsectionChunk);

    // Process nested subsections if any
    if (subsection.subsections && subsection.subsections.length > 0) {
      processSubsections(
        subsection.subsections,
        chunks,
        `${parentContext}\nSubsection ${subsection.number}`
      );
    }
  });
}
