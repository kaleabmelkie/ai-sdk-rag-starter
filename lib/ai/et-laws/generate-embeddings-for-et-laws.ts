import { embeddingModel } from "@/lib/ai/embedding";
import {
  EtLawsChunk,
  EtLawsSection,
  EtLawsSubsection,
} from "@/lib/types/et-laws-chunk";
import { embedMany } from "ai";

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

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
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
