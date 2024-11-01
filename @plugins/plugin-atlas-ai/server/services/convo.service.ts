import { Strapi } from "@strapi/strapi";
import { extractContent, compressContent, extractConvo } from "../utils";

import {
  Message,
  Conversation,
  CompressedConversation,
  StandardResponse,
} from "../../@types/atlas";

const convoObject = "plugin::plugin-atlas-ai.conversation";

export default ({ strapi }: { strapi: Strapi }) => ({
  async createConvo(ctx): Promise<StandardResponse<Conversation>> {
    if (!strapi?.db)
      return {
        error: new Error("Strapi not initialized"),
        data: null,
      };
    const { name, content } = ctx.request.body;
    let convo: CompressedConversation = await strapi.db
      .query(convoObject)
      .create({
        data: {
          content: compressContent(content),
          userId: ctx.state.user.id,
          name,
        },
      });
    if (!convo) {
      return {
        error: new Error("Failed to create conversation"),
        data: null,
      };
    }

    return {
      error: null,
      data: extractConvo(convo),
    };
  },
  async readConvo(ctx) {
    if (!strapi?.db) return;
    const { id } = ctx.params;
    const convo = await strapi.db.query(convoObject).findOne({
      select: ["content"],
      where: {
        id: id,
        userId: ctx.state.user.id,
      },
    });
    return extractContent(convo.content);
  },
  async getConvo(ctx): Promise<StandardResponse<Conversation>> {
    strapi.log.debug(
      `Getting convo with id: ${ctx.params.id} and user id ${ctx.state.user.id}`
    );
    if (!strapi?.db) {
      return {
        error: new Error("Strapi not initialized"),
        data: null,
      };
    }
    const { id } = ctx.params;
    const convo = await strapi.db.query(convoObject).findOne({
      select: ["content", "id", "name", "createdAt", "updatedAt"],
      where: {
        userId: ctx.state.user.id,
        id: id,
      },
    });

    strapi.log.debug("convo: ");
    strapi.log.debug(convo);

    return {
      data: extractConvo(convo),
      error: null,
    };
  },
  async readConvoNames(ctx) {
    if (!strapi?.db) return;
    let convos = await strapi.db.query(convoObject).findMany({
      select: ["id", "name", "createdAt", "updatedAt"],
      where: {
        $not: {
          name: null,
        },
        userId: ctx.state.user.id,
      },
    });
    convos = convos.map((convo) => {
      return { ...convo, content: [] };
    });
    if (convos.length > 0) {
      let mockCTX = ctx;
      mockCTX.params.id = convos[0].id;
      const conversation = await this.readConvo(mockCTX);
      convos[0].content = conversation;
    }
    return convos;
  },
  async updateConvo(ctx): Promise<StandardResponse<Conversation>> {
    if (!strapi?.db) {
      return {
        error: new Error("Strapi not initialized"),
        data: null,
      };
    }
    const { id } = ctx.params;
    const { name, content, overwrite = false } = ctx.request.body;
    let finalContent: Array<Message> = content;

    if (!overwrite) {
      const oldConvo = await strapi.db.query(convoObject).findOne({
        select: ["content"],
        where: {
          userId: ctx.state.user.id,
          id: id,
        },
      });

      const _oldContent = extractContent(oldConvo.content);
      finalContent = [..._oldContent, ...content];
    }

    const convo = await strapi.db.query(convoObject).update({
      where: {
        id,
      },
      data: {
        name,
        content: compressContent(finalContent),
      },
    });

    return {
      data: extractConvo(convo),
      error: null,
    };
  },
  async deleteConvo(ctx) {
    strapi.log.error("deleteconvo");

    if (!strapi?.db) {
      strapi.log.error("Database connection is not initialized.");
      return;
    }

    const { id } = ctx.params;

    if (!id) {
      strapi.log.error("ID parameter is missing.");
      return;
    }

    try {
      strapi.entityService?.delete(
        "plugin::plugin-atlas-ai.conversation",
        id
      );
      strapi.log.info(`Conversation with ID: ${id} deleted successfully.`);
      // if (!convo) {
      //   console.warn(`No conversation found with ID: ${id}`);
      // } else {
      //   console.log(`Conversation with ID: ${id} deleted successfully.`);
      // }

      // return convo;
    } catch (error) {
      strapi.log.error(`Error deleting conversation with ID: ${id}`, error);
      throw error;
    }
  },
});
