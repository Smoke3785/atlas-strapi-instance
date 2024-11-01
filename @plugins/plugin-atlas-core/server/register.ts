import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    plugin: "plugin-atlas-core",
    name: "ElectronRelation",
    type: "richtext",
  });
};
