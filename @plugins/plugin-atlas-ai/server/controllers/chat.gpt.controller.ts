import { Strapi } from "@strapi/strapi";
import { StandardResponse, Message } from "../../@types/atlas";

function gpts(strapi: Strapi) {
  return strapi.plugin("plugin-atlas-ai").service("superGptService");
}

export default ({ strapi }: { strapi: Strapi }) => ({
  async prompt(ctx) {
    const data: StandardResponse<Message> = await gpts(
      strapi
    ).getResponseFromChatGpt(ctx);

    ctx.send(data);
  },
  async createImage(ctx) {
    const data = await gpts(strapi).getImageResponsefromChatGpt(ctx);
    ctx.send(data);
  },
  async generateName(ctx) {
    const data = await gpts(strapi).generateNameFromPrompt(ctx);
    ctx.send(data);
  },
  async createAudio(ctx) {
    const data = await gpts(strapi).getAudioFromText(ctx);
    ctx.send(data);
  },
});
