import { Event } from "@strapi/database/dist/lifecycles";
import { Attribute, Strapi } from "@strapi/strapi";
import { JSDOM } from "jsdom";

import { requestOpenAICompletion } from "./openai";

type ForkedEvent = Event & Partial<{ result: { id } }>;

function extractTextFromHtml(htmlString) {
  // Parse the HTML string into a virtual DOM
  const dom = new JSDOM(htmlString);

  // Use textContent to get the text inside the body tag
  const textContent = dom?.window?.document?.body?.textContent || "";

  // Optionally, you can trim whitespace and normalize spaces
  return textContent.trim().replace(/\s+/g, " ");
}

// LLM
async function requestLlmFieldGeneration(
  { contentType, entryId, field, data },
  strapi
) {
  // Parse the HTML string into a virtual DOM
  const sanitizedData = extractTextFromHtml(data);
  let endpoint = "/api/llm-snippets";
  let callbackData = {
    contentType,
    entryId,
    field,
  };

  strapi.log.debug(JSON.stringify({ contentType, entryId, field, data }));

  // Check to see if there is already a LLM snippet for this field
  const existingSnippet =
    (
      await strapi.entityService.findMany("api::llm-snippet.llm-snippet", {
        filters: {
          contentType,
          entryId,
          field,
        },
      })
    )?.[0]?.id || null;

  const { data: summarizedData, error } = await requestOpenAICompletion(
    sanitizedData,
    strapi
  );

  if (error) {
    strapi.log.error(`Failed to process chunk ${field}: ${error}`);
    return;
  }

  strapi.log.debug(
    JSON.stringify({
      data: sanitizedData,
      summarizedData,
      callbackData,
      endpoint,
    })
  );

  let snippetData;

  // If there is an existing snippet, update it
  if (existingSnippet) {
    endpoint += `/${existingSnippet}`;
    snippetData = await strapi.entityService.update(
      "api::llm-snippet.llm-snippet",
      existingSnippet,
      {
        data: {
          data: summarizedData,
        },
      }
    );
  } else {
    // Otherwise, create a new snippet
    snippetData = await strapi.entityService.create(
      "api::llm-snippet.llm-snippet",
      {
        data: {
          entryId: Number(entryId),
          data: summarizedData,
          contentType,
          field,
        },
      }
    );
  }

  strapi.log.info(`[Iliad] Created/updated LLM snippet for ${field}`);
  strapi.log.debug(JSON.stringify(snippetData));
}

function handleUpdateLLM(
  { model, params, result }: ForkedEvent,
  strapi: Strapi
) {
  const entryId = params?.data?.id || result?.id;
  const contentType = model.uid;

  const llmFieldKeys = Object.entries(model.attributes).flatMap(
    ([key, { generateLlmSnippet }]: [any, Record<any, any>]) =>
      generateLlmSnippet ? key : []
  );

  const llmFields = llmFieldKeys.map((key) => [
    key,
    params?.data?.[key] || null,
  ]);

  if (!llmFields.length) {
    return;
  }

  for (let [field, data] of llmFields) {
    requestLlmFieldGeneration(
      {
        contentType,
        entryId,
        field,
        data,
      },
      strapi
    );
  }
}

export default ({ strapi }: { strapi: Strapi }) => {
  if (!strapi?.db) return;

  // bootstrap phase
  strapi.db.lifecycles.subscribe({
    async afterCreate(event: Event) {
      // fs.writeFileSync("afterCreate.json", JSON.stringify(event));
      handleUpdateLLM(event, strapi);
    },
    async afterUpdate(event: Event) {
      // fs.writeFileSync("afterUpdate.json", JSON.stringify(event));
      handleUpdateLLM(event, strapi);
    },
  });
};
