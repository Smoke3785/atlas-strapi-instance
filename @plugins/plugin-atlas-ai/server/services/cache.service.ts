import { Strapi } from "@strapi/strapi";
import config from "../openaiConfig";

export default ({ strapi }: { strapi: Strapi }) => ({
  getConfig() {
    try {
      // @ts-ignore
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "plugin-atlas-ai",
      });

      return pluginStore.get({ key: "supergpt" });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while fetching chatGPT config. Please try after some time",
      };
    }
  },
  updateConfig(ctx) {
    try {
      const body = ctx.request.body;
      const data = {
        apiKey: process.env.OPEN_AI_API_KEY,
        modelName: config.MODEL_NAME,
        projectName: process.env.OPEN_AI_PROJECT_ID,
        temperature: 0.3,
        // maxTokens: body.maxTokens || 2048,
        // topP: body.topP,
        // frequencyPenalty: body.frequencyPenalty || 0.0,
        // presencePenalty: body.presencePenalty || 0.0,
        // stop: body.stop || "",
        // convoCount: body.Count || "",
        // ttsModelName: body.ttsModelName || ""
      };

      // @ts-ignore
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "plugin-atlas-ai",
      });
      return pluginStore.set({
        key: "supergpt",
        value: data,
      });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while updating the chatGPT config. Please try after some time",
      };
    }
  },
});
