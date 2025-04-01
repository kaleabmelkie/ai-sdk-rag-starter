"use server";

import { textOcr } from "@/lib/ai/ocr";
import {
  EtLawsChunk,
  EtLawsSection,
  EtLawsSubsection,
} from "@/lib/types/et-laws-chunk";
import { generateObject, jsonSchema } from "ai";
import { google } from "../ai/models";
import { z } from "zod";

export async function extractLawText(url: string) {
  try {
    if (!url) {
      return {
        success: false,
        error: "No URL provided",
      } as const;
    }

    if (!url.toLowerCase().endsWith(".pdf")) {
      return {
        success: false,
        error: "Only PDF URLs are supported",
      } as const;
    }

    const fullMarkdown = await textOcr(url);

    console.log(fullMarkdown);

    return {
      success: true,
      text: fullMarkdown,
    } as const;
  } catch (error) {
    console.error("Error extracting law text:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}

export async function processLawText(text: string) {
  try {
    const result = await generateObject<EtLawsChunkSchema>({
      model: google.chat("gemini-2.5-pro-exp-03-25", {
        useSearchGrounding: false,
        structuredOutputs: false,
      }),
      temperature: 0,
      maxRetries: 3,
      mode: "json",
      output: "object",
      schema: etLawsChunkSchema,
      schemaName: "Law",
      system: `You are a precise legal document parser. Extract the content from the provided law document and structure it exactly according to the provided schema. Maintain the exact verbatim text from the document. Do not summarize or paraphrase. Use your understanding of the contents of the document only to structure the output in an accurate hierarchy.`,
      prompt: `Parse the following law document into the required JSON structure:\n\n\`\`\`markdown\n${text}\n\`\`\``,
    });

    console.log(result);
    console.log(JSON.stringify({ chunks: result.object.chunks }, null, 2));

    return {
      success: true,
      chunks: result.object.chunks as EtLawsChunk[],
    } as const;
  } catch (error) {
    console.error("Error processing law text:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}

// Define schemas that match our type definitions
const subsectionSchema: z.ZodType<EtLawsSubsection> = z.lazy(() =>
  z.object({
    id: z.string(),
    number: z.string(),
    content: z.string(),
    subsections: z.array(subsectionSchema),
  })
);

const sectionSchema: z.ZodType<EtLawsSection> = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  content: z.string(),
  subsections: z.array(subsectionSchema),
});

const etLawsChunkSchema: z.ZodType<{ chunks: EtLawsChunk[] }> = z.object({
  chunks: z.array(
    z.object({
      id: z.string(),
      number: z.string(),
      title: z.string(),
      sections: z.array(sectionSchema),
    })
  ),
});

type EtLawsChunkSchema = { chunks: EtLawsChunk[] };
