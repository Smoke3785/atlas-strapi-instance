"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chat_gpt_controller_1 = require("./chat.gpt.controller");
var convo_controller_1 = require("./convo.controller");
var cache_controller_1 = require("./cache.controller");
var context_controller_1 = require("./context.controller");
exports.default = {
    contextController: context_controller_1.default,
    chatGptController: chat_gpt_controller_1.default,
    convoController: convo_controller_1.default,
    cacheController: cache_controller_1.default,
};
