import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@/lib/ai/models";
import { streamText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"), // or "o3-mini"
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
If no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    tools: {
      //       addResource: tool({
      //         description: `add a resource to your knowledge base.
      // If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
      //         parameters: z.object({
      //           content: z
      //             .string()
      //             .describe("the content or resource to add to the knowledge base"),
      //         }),
      //         execute: async ({ content }) => createResource({ content }),
      //       }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
      getTimeAndDate: tool({
        description: `get the current time and date.`,
        parameters: z.object({}),
        execute: async () => {
          const date = new Date();
          return {
            time: date.toLocaleTimeString(),
            date: date.toLocaleDateString(),
          };
        },
      }),
    },
  });

  const stream = result.toDataStreamResponse();

  return stream;
}
