import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getContext(ctx) {
    const data = await strapi
      .plugin("plugin-atlas-ai")
      .service("contextService")
      .getContext(ctx);
    ctx.send(data);
  },
});
