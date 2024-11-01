"use strict";

const parse = require("html-react-parser").default;
const { JSDOM } = require("jsdom");
const fs = require("fs");

function validAttributes(attribs) {
  if (!attribs) {
    return false;
  }

  if (typeof attribs !== "object") {
    return false;
  }

  if (Object.keys(attribs).length === 0) {
    return false;
  }

  return true;
}

function extractAllImagesWithId(html, baseId) {
  let images = [];
  let toc = [];

  parse(html, {
    replace: ({ attribs, name }) => {
      strapi.log.info(JSON.stringify(attribs), validAttributes(attribs));

      switch (true) {
        // Headings
        case ["h1", "h2", "h3", "h4", "h5", "h6"].includes(name?.toLowerCase()):
          {
          }
          break;

        // Images
        case validAttributes(attribs) && attribs?.["data-id"]:
          {
            images.push(attribs?.["data-id"]);
          }
          break;
      }
    },
  });

  return images;
}

function generateAdditionalBodyData(html, baseId) {
  let atomic = 0;

  let images = [];
  let toc = [];

  parse(html, {
    replace: ({ attribs, name }) => {
      strapi.log.info(JSON.stringify(attribs), validAttributes(attribs));

      switch (true) {
        // Headings
        case ["h1", "h2", "h3", "h4", "h5", "h6"].includes(name?.toLowerCase()):
          {
            if (!baseId) return; // This only works if we include the base ID of the document.
            let order = Number(name?.toLowerCase()?.[1]);

            const key = `${baseId}-${atomic}-${order}`;
            atomic++;

            toc.push({
              order,
              key,
            });
          }
          break;

        // Images
        case validAttributes(attribs) && attribs?.["data-id"]:
          {
            images.push(attribs?.["data-id"]);
          }
          break;
      }
    },
  });

  return [images, toc];
}

async function handleArticleUpdate(event) {
  let baseId = event?.params?.data?.id;
  let html = event?.params?.data?.body;

  if (!html) {
    return;
  }

  let imageData = {};

  let [images, toc] = generateAdditionalBodyData(html, baseId);

  for (let imageId of images) {
    strapi.log.info(JSON.stringify(imageId));

    const imageFile = await strapi.entityService.findOne(
      "plugin::upload.file",
      imageId
    );

    if (!imageFile) {
      continue;
    } else {
      imageData[imageId] = imageFile;
    }
  }

  strapi.log.info(JSON.stringify(images));
  strapi.log.info(JSON.stringify(imageData));

  event.params.data.derived_data = JSON.stringify({
    "plugin::upload.file": imageData,
    tableOfContents: toc,
  });
}

function extractTextFromHtml(htmlString) {
  // Parse the HTML string into a virtual DOM
  const dom = new JSDOM(htmlString);

  // Use textContent to get the text inside the body tag
  const textContent = dom.window.document.body.textContent;

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

  // Check to see if there is already a LLM snippet for this field
  let existingSnippet = await strapi.entityService.findMany(
    "api::llm-snippet.llm-snippet",
    {
      filters: {
        contentType,
        entryId,
        field,
      },
    }
  );

  if (existingSnippet) {
    endpoint += `/${existingSnippet.id}`;
  }

  fs.writeFileSync(
    "llmData.json",
    JSON.stringify({
      data: sanitizedData,
      callbackData,
      endpoint,
    })
  );
}

function handleUpdateLLM({ model, params }, strapi) {
  const entryId = params.data.id;
  const contentType = model.uid;

  const llmFieldKeys = Object.entries(model.attributes).flatMap(
    ([key, { generateLlmSnippet }]) => (generateLlmSnippet ? key : [])
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

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["api::article.article"],
      async beforeCreate(event) {
        await handleArticleUpdate(event);
      },
      async beforeUpdate(event) {
        await handleArticleUpdate(event);
      },
    });

    // strapi.db.lifecycles.subscribe({
    //   async afterCreate(event) {
    //     fs.writeFileSync("afterCreate.json", JSON.stringify(event));
    //     handleUpdateLLM(event, strapi);
    //   },
    //   async afterUpdate(event) {
    //     fs.writeFileSync("afterUpdate.json", JSON.stringify(event));
    //     handleUpdateLLM(event, strapi);
    //   },
    // });
  },
};
