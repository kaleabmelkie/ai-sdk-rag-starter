import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "../env.mjs";

export const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});
