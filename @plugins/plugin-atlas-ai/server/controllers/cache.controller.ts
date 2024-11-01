import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async updateConfig(ctx) {
    const data = await strapi
      .plugin("plugin-atlas-ai")
      .service("cacheService")
      .updateConfig(ctx);
    ctx.send(data);
  },
  async getConfig(ctx) {
    const data = await strapi
      .plugin("plugin-atlas-ai")
      .service("cacheService")
      .getConfig(ctx);
    ctx.send(data);
  },
});
