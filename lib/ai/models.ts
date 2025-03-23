import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createOpenAI } from "@ai-sdk/openai";
import { createReplicate } from "@ai-sdk/replicate";

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const replicate = createReplicate({
  apiToken: process.env.REPLICATE_API_TOKEN,
});
