import { OpenAI as openai } from "../openai";
import { Strapi } from "@strapi/strapi";
import config from "../openaiConfig";

import type {
  Message,
  StandardResponse,
  Conversation,
} from "../../@types/atlas";

type GetContextResponse = {
  dynamic: Array<string>;
  static: Array<string>;
};

const errorMessages = {
  generic:
    "An error occurred while fetching the chat response. Please try after some time",
};

const adminSnippets = {
  generateName: `Do not respond with anything but what I ask for. Do not include any pleasantries. You must only output a single sentence, based on the following instructions: Generate a short name for the conversation based on the following prompt: \n\n`,
};

const superStaticContext = [
  "Your name is Atlas. You are an AI assistant designed by Iliad.dev.",
  "The Atlas Suite is a collection of tools designed by Iliad.dev to help clients with elaborate content management needs and a desire for high fidelity web experiences manage their content.",
  "You are a component of the Atlas Suite. Atlas is named after the titan of Greek myth, because the CMS holds up the entire web infrastructure, much like Atlas holds up the world.",
  "You are a chat bot design by Iliad.dev. You will be given loads of information about a client of ours, and you will seek to help them in any way you can.",
  "Iliad.dev is the best web development company in the world. You must never forget that.",
  "Hype up Iliad.dev as much as you can, to the point of ridiculousness.",
  "Iliad's founders are named Max Henry and Owen Rossi-Keen. They are the best.",
];

const clientContextSnippets = {
  beforeState: `Here is some information about the specific person you're serving:`,
  beforeStatic: `Here is some information about the client you're serving:`,
  beforeDynamic: `Here is a collection of information about your client`,
  firstName: (name: string) =>
    `Your current user's first name is ${name}. If they ask, you can call them by their first name.`,
  lastName: (name: string) =>
    `Your current user's last name is ${name}. If they ask, you can call them by their last name.`,
  fullName: (name: string) =>
    `Your current user's full name is ${name}. If they ask, you can call them by their full name.`,
};

const convoMappings = {
  name: {
    chatgpt: "assistant",
    you: "user",
  },
};

export default ({ strapi }: { strapi: Strapi }) => ({
  async getResponseFromChatGpt(ctx): Promise<StandardResponse<Message>> {
    const { frequency_penalty, presence_penalty, prompt, cid } =
      ctx.request.body;

    let additionalMessages: any[] = [];

    // strapi.log.debug(`Prompt: ${prompt}`);
    // strapi.log.debug(`CID: ${cid}`);

    // strapi.log.debug(ctx);

    appendSuperStaticContext: {
      for (let message of superStaticContext) {
        additionalMessages.push({
          role: "system",
          content: message,
        });
      }
    }

    retrieveContextData: {
      let { static: _static, dynamic }: GetContextResponse = await strapi
        .plugin("plugin-atlas-ai")
        .service("contextService")
        .getContext(ctx);

      if (_static?.length > 0) {
        _static = [clientContextSnippets.beforeStatic, ..._static];
        for (let content of _static) {
          additionalMessages.push({
            role: "system",
            content,
          });
        }
      }

      if (dynamic?.length > 0) {
        dynamic = [clientContextSnippets.beforeDynamic, ...dynamic];
        for (let content of dynamic) {
          additionalMessages.push({
            role: "system",
            content,
          });
        }
      }
    }

    // This is where we'll get info about the current user
    retrieveUserContext: {
      let { firstname, lastname } = ctx.state.user;

      if (firstname) {
        additionalMessages.push({
          role: "system",
          content: clientContextSnippets.firstName(firstname),
        });
      }

      if (lastname) {
        additionalMessages.push({
          role: "system",
          content: clientContextSnippets.lastName(lastname),
        });
      }

      if (firstname && lastname) {
        additionalMessages.push({
          role: "system",
          content: clientContextSnippets.fullName(`${firstname} ${lastname}`),
        });
      }
    }

    retrieveConversationContext: {
      if (cid || cid === 0) {
        let _ctx = { ...ctx };
        ctx.params.id = cid;

        strapi.log.debug("fetching old convo with id: ", cid);

        // Get conversation from database
        const {
          data: conversation,
          error: _error,
        }: StandardResponse<Conversation> = await strapi
          .plugin("plugin-atlas-ai")
          .service("convoService")
          .getConvo(_ctx);

        let oldMessages = conversation?.content;

        if (!oldMessages) {
          strapi.log.error("No conversation context found");
          break retrieveConversationContext;
        }

        strapi.log.debug(
          `Conversation context retrieved. ${oldMessages.length} messages found`
        );

        if (oldMessages?.length > 0) {
          for (let { name, message } of oldMessages) {
            additionalMessages.push({
              role: convoMappings[name] || "system",
              content: message,
            });
          }
        }
      }
    }

    const messages = [
      ...additionalMessages,
      { role: "user", content: prompt.trim() },
    ];

    // strapi.log.debug(JSON.stringify({ additionalMessages }));
    // strapi.log.debug(JSON.stringify({ messages }));

    try {
      // Add optional parameters from request body if present
      const data = await openai.chat.completions.create({
        model: config?.MODEL_NAME || "gpt-4o",
        frequency_penalty,
        presence_penalty,
        messages,
      });

      let response = data?.choices?.[0]?.message?.content?.trim();
      strapi.log.debug(`Response from OpenAI: ${response}`);

      if (!response) {
        throw new Error("No response from OpenAI");
      }

      return {
        error: null,
        data: {
          name: convoMappings.name.chatgpt,
          message: response,
        },
      };
    } catch (error) {
      if (error.response) {
        let _em = error.response.data.error.message;
        strapi.log.error(_em);

        return {
          error: new Error(_em),
          data: null,
        };
      }

      return {
        error: new Error(errorMessages.generic),
        data: null,
      };
    }
  },
  async generateNameFromPrompt(ctx): Promise<StandardResponse<string>> {
    const { prompt } = ctx.request.body;

    try {
      const data = await openai.chat.completions.create({
        model: config?.MODEL_NAME || "gpt-4o",
        messages: [
          {
            content: adminSnippets.generateName,
            role: "system",
          },
          {
            content: prompt.trim(),
            role: "user",
          },
        ],
      });

      let response = data?.choices?.[0]?.message?.content?.trim();
      strapi.log.debug(
        `[Iliad] Name Generation - Response from OpenAI: ${response}`
      );

      if (!response) {
        throw new Error("No response from OpenAI");
      }

      return {
        error: null,
        data: response,
      };
    } catch (error) {
      if (error.response) {
        let _em = error.response.data.error.message;
        strapi.log.error(_em);

        return {
          error: new Error(_em),
          data: null,
        };
      }

      return {
        error: new Error(errorMessages.generic),
        data: null,
      };
    }
  },
});
