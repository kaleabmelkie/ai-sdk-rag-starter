"use server";

import { openai } from "@/lib/ai/models";
import { textOcr } from "@/lib/ai/ocr";
import { EtLawsChunk } from "@/lib/types/et-laws-chunk";
import { generateObject, jsonSchema } from "ai";

export async function extractLawText(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }
    if (!file.type.includes("pdf")) {
      return {
        success: false,
        error: "Only PDF files are supported",
      };
    }

    const fullMarkdown = await textOcr(
      "https://api.mekdesmezgebu.com/uploads/NBE_Foreign_Exchange_Directive_01_2024_7bfd095c57.pdf"
    );

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
    const result = await generateObject<typeof etLawsChunkSchema._type>({
      model: openai.chat("gpt-4o-mini", {}),
      temperature: 0,
      presencePenalty: 1,
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
      chunks: result.object.chunks,
    } as const;
  } catch (error) {
    console.error("Error processing law text:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}

const etLawsChunkSchema = jsonSchema<{ chunks: EtLawsChunk[] }>({
  type: "object",
  properties: {
    chunks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          partNumber: { type: "number" },
          partTitle: { type: "string" },
          sectionNumber: { type: "number" },
          sectionTitle: { type: "string" },
          content: { type: "string" },
          subsections: {
            type: "array",
            items: {
              $ref: "#/definitions/subsectionSchema",
            },
          },
        },
        required: [
          "partNumber",
          "partTitle",
          "sectionNumber",
          "sectionTitle",
          "content",
          "subsections",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["chunks"],
  additionalProperties: false,
  definitions: {
    subsectionSchema: {
      type: "object",
      properties: {
        subsectionNumber: { type: "number" },
        subsectionContent: { type: "string" },
        subsections: {
          type: "array",
          items: {
            $ref: "#/definitions/subsectionSchema",
          },
        },
      },
      required: ["subsectionNumber", "subsectionContent", "subsections"],
      additionalProperties: false,
    },
  },
});

// Keeping the original function for backward compatibility
export async function processLawDocument(formData: FormData) {
  try {
    const extractResult = await extractLawText(formData);
    if (!extractResult.success) {
      return extractResult;
    }

    if (!extractResult.text) {
      return {
        success: false,
        error: "No text extracted",
      } as const;
    }

    return processLawText(extractResult.text);
  } catch (error) {
    console.error("Error processing law document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}
