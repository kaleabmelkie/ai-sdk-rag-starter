import { embeddingModel } from "@/lib/ai/embedding";
import { EtLawsChunk } from "@/lib/types/et-laws-chunk";
import { embedMany } from "ai";

export async function generateEmbeddingsForEtLaws(
  data: EtLawsChunk[]
): Promise<{ embedding: number[]; content: string }[]> {
  const chunks: string[] = [];

  // Process each law chunk
  data.forEach((chunk) => {
    // Create a chunk with part, section title and content
    const mainChunk = `Part ${chunk.partNumber}: ${chunk.partTitle} - Section ${chunk.sectionNumber}: ${chunk.sectionTitle}\n${chunk.content}`;
    chunks.push(mainChunk);

    // Process subsections recursively
    if (chunk.subsections && chunk.subsections.length > 0) {
      processSubsections(
        chunk.subsections,
        chunks,
        `Part ${chunk.partNumber}: ${chunk.partTitle} - Section ${chunk.sectionNumber}: ${chunk.sectionTitle}`
      );
    }
  });

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}

// Helper function to process subsections recursively
function processSubsections(
  subsections: Array<{
    subsectionNumber: number | string;
    subsectionContent: string;
    subsections: any[];
  }>,
  chunks: string[],
  parentContext: string
): void {
  subsections.forEach((subsection) => {
    // Create a chunk with parent context and current subsection
    const subsectionChunk = `${parentContext}\nSubsection ${subsection.subsectionNumber}: ${subsection.subsectionContent}`;
    chunks.push(subsectionChunk);

    // Process nested subsections if any
    if (subsection.subsections && subsection.subsections.length > 0) {
      processSubsections(
        subsection.subsections,
        chunks,
        `${parentContext}\nSubsection ${subsection.subsectionNumber}`
      );
    }
  });
}
