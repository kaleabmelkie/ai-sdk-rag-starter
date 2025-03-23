import { Mistral } from "@mistralai/mistralai";

export const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function textOcr(pdfUrl: string) {
  const ocrResponse = await mistralClient.ocr.process({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      documentUrl: pdfUrl,
    },
    imageLimit: 0,
    includeImageBase64: false,
  });
  const fullMarkdown = ocrResponse.pages
    .map((page) => page.markdown)
    .join("\n");

  return fullMarkdown;
}
