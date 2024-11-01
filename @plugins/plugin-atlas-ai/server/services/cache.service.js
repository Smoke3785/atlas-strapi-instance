"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openaiConfig_1 = require("../openaiConfig");
exports.default = (function (_a) {
    var strapi = _a.strapi;
    return ({
        getConfig: function () {
            try {
                // @ts-ignore
                var pluginStore = strapi.store({
                    environment: strapi.config.environment,
                    type: "plugin",
                    name: "plugin-atlas-ai",
                });
                return pluginStore.get({ key: "supergpt" });
            }
            catch (error) {
                strapi.log.error(error.message);
                return {
                    error: "An error occurred while fetching chatGPT config. Please try after some time",
                };
            }
        },
        updateConfig: function (ctx) {
            try {
                var body = ctx.request.body;
                var data = {
                    apiKey: process.env.OPEN_AI_API_KEY,
                    modelName: openaiConfig_1.default.MODEL_NAME,
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
                var pluginStore = strapi.store({
                    environment: strapi.config.environment,
                    type: "plugin",
                    name: "plugin-atlas-ai",
                });
                return pluginStore.set({
                    key: "supergpt",
                    value: data,
                });
            }
            catch (error) {
                strapi.log.error(error.message);
                return {
                    error: "An error occurred while updating the chatGPT config. Please try after some time",
                };
            }
        },
    });
});
