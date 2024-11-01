"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var chat_gpt_routes_1 = require("./chat.gpt.routes");
var context_routes_1 = require("./context.routes");
var convo_routes_1 = require("./convo.routes");
var cache_routes_1 = require("./cache.routes");
exports.default = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], context_routes_1.default, true), chat_gpt_routes_1.default, true), convo_routes_1.default, true), cache_routes_1.default, true);
