import { Strapi } from "@strapi/strapi";

import { StandardResponse, Conversation } from "../../@types/atlas";

function gpts(strapi: Strapi) {
  return strapi.plugin("plugin-atlas-ai").service("convoService");
}

export default ({ strapi }: { strapi: Strapi }) => ({
  async createConvo(ctx) {
    const data: StandardResponse<Conversation> = await gpts(strapi).createConvo(
      ctx
    );
    ctx.send(data);
  },
  async readConvo(ctx) {
    // strapi.log.debug(
    //   `controller: Reading convo with id: ${ctx.params.id} and user id ${ctx.state.user.id}`
    // );
    const data = await gpts(strapi).getConvo(ctx);
    // strapi.log.debug(`controller: data: `);
    // strapi.log.debug(data);
    // strapi.log.debug(JSON.stringify(data));

    ctx.send(data);
  },
  async readConvoNames(ctx) {
    const data = await gpts(strapi).readConvoNames(ctx);
    ctx.send(data);
  },
  async updateConvo(ctx) {
    const data = await gpts(strapi).updateConvo(ctx);
    ctx.send(data);
  },
  async deleteConvo(ctx) {
    const data = await gpts(strapi).deleteConvo(ctx);
    ctx.send(data);
  },
});
