"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chat_gpt_service_1 = require("./chat-gpt.service");
var context_service_1 = require("./context.service");
var convo_service_1 = require("./convo.service");
var cache_service_1 = require("./cache.service");
exports.default = {
    superGptService: chat_gpt_service_1.default,
    contextService: context_service_1.default,
    convoService: convo_service_1.default,
    cacheService: cache_service_1.default,
};
