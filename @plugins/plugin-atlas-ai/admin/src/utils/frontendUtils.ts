import type { RouteComponentProps } from "react-router-dom";

import type {
  Message,
  Conversation,
  StandardResponse,
  CurrentConversation,
} from "../../../@types/atlas";

// Networking
import { auth } from "@strapi/helper-plugin";
import axios from "axios";

export function hash64(str: string): string {
  const seed = 0;

  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return `${4294967296 * (2097151 & h2) + (h1 >>> 0)}`;
}

// Axios instance - Connection to Strapi
export const instance = axios.create({
  baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
  headers: {
    Authorization: `Bearer ${auth.get("jwtToken")}`,
    "Content-Type": "application/json",
  },
});

/**
 * Converts null to undefined. Ensures the return value is never null.
 *
 * @param obj - The input value which can be of any type.
 * @returns The input value if it is not null, otherwise undefined.
 */
export function nullToUndefined<T>(obj: T | null): T | undefined {
  if (obj === null) {
    return undefined;
  }
  return obj;
}

export function generateConversationId<T = number | string>(): T {
  return Math.floor(Math.random() * 1000000) as T;
}

export async function getConversations() {
  try {
    const { data: conversations } = await instance.get<
      StandardResponse<Array<Conversation>>
    >("/plugin-atlas-ai/convos");

    if (conversations.error) {
      throw new Error(conversations.error.message);
    }

    return conversations;
  } catch (e) {
    return {
      error: e as Error,
      data: null,
    };
  }
}

export async function getConversation(id: number) {
  try {
    const { data: conversation } = await instance.get<
      StandardResponse<Conversation>
    >(`/plugin-atlas-ai/convo/${id}`);

    if (conversation.error) {
      throw new Error(conversation.error.message);
    }

    return conversation;
  } catch (e) {
    return {
      error: e as Error,
      data: null,
    };
  }
}

type SubmitPromptProps = {
  prompt: string;
  cid?: number;
};

export async function submitPrompt({
  prompt,
  cid,
}: SubmitPromptProps): Promise<StandardResponse<Message>> {
  try {
    console.info(`[Iliad] Prompt submitted`, {
      prompt,
      cid,
    });
    const { data } = await instance.post<StandardResponse<Message>>(
      "/plugin-atlas-ai/prompt",
      {
        prompt,
        cid,
      }
    );

    console.info(`[Iliad] Prompt response`, {
      data,
    });
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (e) {
    return {
      error: e as Error,
      data: null,
    };
  }
}

type CreateConversationProps = {
  content?: Array<Message>;
  name?: string;
};

export async function createConversation({
  content,
  name,
}: CreateConversationProps): Promise<StandardResponse<Conversation>> {
  // Eventually we will use OpenAI to generate a name for the conversation
  let conversationName =
    name || `Conversation ${generateConversationId<string>()}`;

  try {
    const { data: generatedName } = await instance.post<
      StandardResponse<string>
    >("/plugin-atlas-ai/generateName", {
      prompt: content?.[0]?.message,
    });

    if (generatedName.error) {
      throw new Error(generatedName.error.message);
    }

    conversationName = generatedName.data;

    const { data: newConvo } = await instance.post<
      StandardResponse<Conversation>
    >("/plugin-atlas-ai/convo", {
      name: conversationName,
      content,
    });

    if (newConvo.error) {
      throw new Error(newConvo.error.message);
    }

    return newConvo;
  } catch (e) {
    return {
      error: e as Error,
      data: null,
    };
  }
}

type UpdateConversationProps = {
  content?: Array<Message>;
  name?: string;
};

export async function updateConversation(
  id: number,
  { content, name }: UpdateConversationProps,
  overwrite: boolean = false
): Promise<StandardResponse<Conversation>> {
  console.log("updateConversation 1", id, content, name, overwrite);

  content = nullToUndefined(content);
  name = nullToUndefined(name);

  console.log("updateConversation 2", id, content, name, overwrite);

  try {
    const { data: updatedConvoData } = await instance.put<
      StandardResponse<Conversation>
    >(`/plugin-atlas-ai/convo/${id}`, {
      overwrite,
      content,
      name,
    });

    if (updatedConvoData.error) {
      console.error(
        `[Iliad] updateConversation error: ${updatedConvoData.error}`,
        updatedConvoData
      );

      return {
        error: updatedConvoData.error,
        data: null,
      };
    } else {
      console.info(`[Iliad] updateConversation success`, updatedConvoData);
    }
    return {
      data: updatedConvoData.data,
      error: null,
    };
  } catch (e) {
    return {
      error: e as Error,
      data: null,
    };
  }
}
type ConversationPageParams = {
  id: string;
};
export function getIdFromRoute(route: RouteComponentProps): number {
  const id = (route.match.params as ConversationPageParams)?.id;
  return Number(id.split("-")[0]);
}

export function getIdFromPathname(pathname: string): number {
  const lastEl = pathname.split("/").pop();
  if (!lastEl) {
    console.error(`[Iliad] getIdFromPathname error: ${pathname}`);
    return -1;
  }
  return Number(lastEl.split("-")[0]);
}

export const utils = {
  getIdFromPathname,
  nullToUndefined,
  getIdFromRoute,
  hash64,
};

export const atlas = {
  createConversation,
  updateConversation,
  getConversations,
  getConversation,
  submitPrompt,
};
