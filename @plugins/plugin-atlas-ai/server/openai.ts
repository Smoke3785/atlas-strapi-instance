import { splitIntoChunks } from "./helperFunctions";
import config from "./openaiConfig";
import { Strapi } from "@strapi/strapi";
import OpenCache from "./OpenCache";
import OpenAIApi from "openai";

export const OpenAI = new OpenAIApi({
  apiKey: process.env.OPEN_AI_API_KEY, // Replace with your OpenAI API key
  project: process.env.OPEN_AI_PROJECT_ID,
});

// CONFIG
const { MAX_CHUNK_SIZE, MODEL_NAME, contentPrompt, optimizationPrompt } =
  config;

type RequestOpenAICompletionInput = {
  existingSnippet: number | null;
  data: string;
};

type RequestOpenAICompletionOutput = {
  error: string | null;
  data: {} | null;
};

export async function requestOpenAICompletion(
  data: string,
  strapi: Strapi
): Promise<RequestOpenAICompletionOutput> {
  let hashKey: string = OpenCache.generateHashKey(data);
  let finalData;

  // Restore from cache if available
  funcBody: {
    if (OpenCache.has(hashKey)) {
      const cachedData = OpenCache.get(hashKey);
      finalData = cachedData?.value;

      break funcBody;
    }
  }

  let processedChunks: any[] = [];
  // Otherwise, process the article.
  const chunks = splitIntoChunks(data);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    let content = `${contentPrompt}${chunk}`;

    // Append prompt to content if at the end.
    if (i === chunks.length - 1) {
      content += `\n\nEnd of the article.`;
    }

    // Process chunk
    try {
      const response = await OpenAI.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            content: optimizationPrompt,
            role: "system",
          },
          {
            content: content,
            role: "user",
          },
        ],
        temperature: 0.3, // Lower temperature for more deterministic results
      });
      const optimized = response?.choices?.[0]?.message?.content?.trim();
      if (!optimized) {
        throw new Error("Failed to optimize the article.");
      }

      processedChunks.push(optimized);
      continue;
    } catch (error) {
      strapi.log.error(`Failed to process chunk ${i}: ${error}`);
      break;
    }
  }

  if (processedChunks.length === 0) {
    strapi.log.error("Failed to process any chunks.");
    return {
      error: "Failed to process any chunks.",
      data: null,
    };
    // throw new Error("Failed to process any chunks.");
  }

  finalData = processedChunks.join("\n\n");

  return {
    data: finalData,
    error: null,
  };
}
