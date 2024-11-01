"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    MAX_CHUNK_SIZE: 6000,
    MODEL_NAME: "gpt-4o-mini",
    optimizationPrompt: "You are a text compression assistant. Your goal is to strip the given content to its absolute essentials. Your output should be as concise as possible, containing only core facts, key data points, and relevant information. Do not include any summaries, headings, or additional comments. Return only the compressed text.",
    contentPrompt: "Optimize the following text for minimal token consumption by stripping out unnecessary text, keeping only relevant facts, key data points, and core messages. Be as concise as possible without losing the main points:\n\n",
};
exports.default = config;
