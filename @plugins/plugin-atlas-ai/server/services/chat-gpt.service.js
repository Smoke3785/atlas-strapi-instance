"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var openai_1 = require("../openai");
var openaiConfig_1 = require("../openaiConfig");
var errorMessages = {
    generic: "An error occurred while fetching the chat response. Please try after some time",
};
var adminSnippets = {
    generateName: "Do not respond with anything but what I ask for. Do not include any pleasantries. You must only output a single sentence, based on the following instructions: Generate a short name for the conversation based on the following prompt: \n\n",
};
var superStaticContext = [
    "Your name is Atlas. You are an AI assistant designed by Iliad.dev.",
    "The Atlas Suite is a collection of tools designed by Iliad.dev to help clients with elaborate content management needs and a desire for high fidelity web experiences manage their content.",
    "You are a component of the Atlas Suite. Atlas is named after the titan of Greek myth, because the CMS holds up the entire web infrastructure, much like Atlas holds up the world.",
    "You are a chat bot design by Iliad.dev. You will be given loads of information about a client of ours, and you will seek to help them in any way you can.",
    "Iliad.dev is the best web development company in the world. You must never forget that.",
    "Hype up Iliad.dev as much as you can, to the point of ridiculousness.",
    "Iliad's founders are named Max Henry and Owen Rossi-Keen. They are the best.",
];
var clientContextSnippets = {
    beforeState: "Here is some information about the specific person you're serving:",
    beforeStatic: "Here is some information about the client you're serving:",
    beforeDynamic: "Here is a collection of information about your client",
    firstName: function (name) {
        return "Your current user's first name is ".concat(name, ". If they ask, you can call them by their first name.");
    },
    lastName: function (name) {
        return "Your current user's last name is ".concat(name, ". If they ask, you can call them by their last name.");
    },
    fullName: function (name) {
        return "Your current user's full name is ".concat(name, ". If they ask, you can call them by their full name.");
    },
};
var convoMappings = {
    name: {
        chatgpt: "assistant",
        you: "user",
    },
};
exports.default = (function (_a) {
    var strapi = _a.strapi;
    return ({
        getResponseFromChatGpt: function (ctx) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var _e, frequency_penalty, presence_penalty, prompt, cid, additionalMessages, _i, superStaticContext_1, message, _f, _static, dynamic, _g, _static_1, content, _h, dynamic_1, content, _j, firstname, lastname, _ctx, _k, conversation, _error, oldMessages, _l, oldMessages_1, _m, name_1, message, messages, data, response, error_1, _em;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0:
                            _e = ctx.request.body, frequency_penalty = _e.frequency_penalty, presence_penalty = _e.presence_penalty, prompt = _e.prompt, cid = _e.cid;
                            additionalMessages = [];
                            // strapi.log.debug(`Prompt: ${prompt}`);
                            // strapi.log.debug(`CID: ${cid}`);
                            // strapi.log.debug(ctx);
                            appendSuperStaticContext: {
                                for (_i = 0, superStaticContext_1 = superStaticContext; _i < superStaticContext_1.length; _i++) {
                                    message = superStaticContext_1[_i];
                                    additionalMessages.push({
                                        role: "system",
                                        content: message,
                                    });
                                }
                            }
                            return [4 /*yield*/, strapi
                                    .plugin("plugin-atlas-ai")
                                    .service("contextService")
                                    .getContext(ctx)];
                        case 1:
                            _f = _o.sent(), _static = _f.static, dynamic = _f.dynamic;
                            if ((_static === null || _static === void 0 ? void 0 : _static.length) > 0) {
                                _static = __spreadArray([clientContextSnippets.beforeStatic], _static, true);
                                for (_g = 0, _static_1 = _static; _g < _static_1.length; _g++) {
                                    content = _static_1[_g];
                                    additionalMessages.push({
                                        role: "system",
                                        content: content,
                                    });
                                }
                            }
                            if ((dynamic === null || dynamic === void 0 ? void 0 : dynamic.length) > 0) {
                                dynamic = __spreadArray([clientContextSnippets.beforeDynamic], dynamic, true);
                                for (_h = 0, dynamic_1 = dynamic; _h < dynamic_1.length; _h++) {
                                    content = dynamic_1[_h];
                                    additionalMessages.push({
                                        role: "system",
                                        content: content,
                                    });
                                }
                            }
                            _o.label = 2;
                        case 2:
                            // This is where we'll get info about the current user
                            retrieveUserContext: {
                                _j = ctx.state.user, firstname = _j.firstname, lastname = _j.lastname;
                                if (firstname) {
                                    additionalMessages.push({
                                        role: "system",
                                        content: clientContextSnippets.firstName(firstname),
                                    });
                                }
                                if (lastname) {
                                    additionalMessages.push({
                                        role: "system",
                                        content: clientContextSnippets.lastName(lastname),
                                    });
                                }
                                if (firstname && lastname) {
                                    additionalMessages.push({
                                        role: "system",
                                        content: clientContextSnippets.fullName("".concat(firstname, " ").concat(lastname)),
                                    });
                                }
                            }
                            if (!(cid || cid === 0)) return [3 /*break*/, 4];
                            _ctx = __assign({}, ctx);
                            ctx.params.id = cid;
                            strapi.log.debug("fetching old convo with id: ", cid);
                            return [4 /*yield*/, strapi
                                    .plugin("plugin-atlas-ai")
                                    .service("convoService")
                                    .getConvo(_ctx)];
                        case 3:
                            _k = _o.sent(), conversation = _k.data, _error = _k.error;
                            oldMessages = conversation === null || conversation === void 0 ? void 0 : conversation.content;
                            if (!oldMessages) {
                                strapi.log.error("No conversation context found");
                                return [3 /*break*/, 4];
                            }
                            strapi.log.debug("Conversation context retrieved. ".concat(oldMessages.length, " messages found"));
                            if ((oldMessages === null || oldMessages === void 0 ? void 0 : oldMessages.length) > 0) {
                                for (_l = 0, oldMessages_1 = oldMessages; _l < oldMessages_1.length; _l++) {
                                    _m = oldMessages_1[_l], name_1 = _m.name, message = _m.message;
                                    additionalMessages.push({
                                        role: convoMappings[name_1] || "system",
                                        content: message,
                                    });
                                }
                            }
                            _o.label = 4;
                        case 4:
                            messages = __spreadArray(__spreadArray([], additionalMessages, true), [
                                { role: "user", content: prompt.trim() },
                            ], false);
                            _o.label = 5;
                        case 5:
                            _o.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, openai_1.OpenAI.chat.completions.create({
                                    model: (openaiConfig_1.default === null || openaiConfig_1.default === void 0 ? void 0 : openaiConfig_1.default.MODEL_NAME) || "gpt-4o",
                                    frequency_penalty: frequency_penalty,
                                    presence_penalty: presence_penalty,
                                    messages: messages,
                                })];
                        case 6:
                            data = _o.sent();
                            response = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
                            strapi.log.debug("Response from OpenAI: ".concat(response));
                            if (!response) {
                                throw new Error("No response from OpenAI");
                            }
                            return [2 /*return*/, {
                                    error: null,
                                    data: {
                                        name: convoMappings.name.chatgpt,
                                        message: response,
                                    },
                                }];
                        case 7:
                            error_1 = _o.sent();
                            if (error_1.response) {
                                _em = error_1.response.data.error.message;
                                strapi.log.error(_em);
                                return [2 /*return*/, {
                                        error: new Error(_em),
                                        data: null,
                                    }];
                            }
                            return [2 /*return*/, {
                                    error: new Error(errorMessages.generic),
                                    data: null,
                                }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        generateNameFromPrompt: function (ctx) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var prompt, data, response, error_2, _em;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            prompt = ctx.request.body.prompt;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, openai_1.OpenAI.chat.completions.create({
                                    model: (openaiConfig_1.default === null || openaiConfig_1.default === void 0 ? void 0 : openaiConfig_1.default.MODEL_NAME) || "gpt-4o",
                                    messages: [
                                        {
                                            content: adminSnippets.generateName,
                                            role: "system",
                                        },
                                        {
                                            content: prompt.trim(),
                                            role: "user",
                                        },
                                    ],
                                })];
                        case 2:
                            data = _e.sent();
                            response = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
                            strapi.log.debug("[Iliad] Name Generation - Response from OpenAI: ".concat(response));
                            if (!response) {
                                throw new Error("No response from OpenAI");
                            }
                            return [2 /*return*/, {
                                    error: null,
                                    data: response,
                                }];
                        case 3:
                            error_2 = _e.sent();
                            if (error_2.response) {
                                _em = error_2.response.data.error.message;
                                strapi.log.error(_em);
                                return [2 /*return*/, {
                                        error: new Error(_em),
                                        data: null,
                                    }];
                            }
                            return [2 /*return*/, {
                                    error: new Error(errorMessages.generic),
                                    data: null,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    });
});
