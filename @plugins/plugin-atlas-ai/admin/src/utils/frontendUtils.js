"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.atlas = exports.utils = exports.getIdFromPathname = exports.getIdFromRoute = exports.updateConversation = exports.createConversation = exports.submitPrompt = exports.getConversation = exports.getConversations = exports.generateConversationId = exports.nullToUndefined = exports.instance = exports.hash64 = void 0;
// Networking
var helper_plugin_1 = require("@strapi/helper-plugin");
var axios_1 = require("axios");
function hash64(str) {
    var seed = 0;
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch = void 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return "".concat(4294967296 * (2097151 & h2) + (h1 >>> 0));
}
exports.hash64 = hash64;
// Axios instance - Connection to Strapi
exports.instance = axios_1.default.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
        Authorization: "Bearer ".concat(helper_plugin_1.auth.get("jwtToken")),
        "Content-Type": "application/json",
    },
});
/**
 * Converts null to undefined. Ensures the return value is never null.
 *
 * @param obj - The input value which can be of any type.
 * @returns The input value if it is not null, otherwise undefined.
 */
function nullToUndefined(obj) {
    if (obj === null) {
        return undefined;
    }
    return obj;
}
exports.nullToUndefined = nullToUndefined;
function generateConversationId() {
    return Math.floor(Math.random() * 1000000);
}
exports.generateConversationId = generateConversationId;
function getConversations() {
    return __awaiter(this, void 0, void 0, function () {
        var conversations, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.instance.get("/plugin-atlas-ai/convos")];
                case 1:
                    conversations = (_a.sent()).data;
                    if (conversations.error) {
                        throw new Error(conversations.error.message);
                    }
                    return [2 /*return*/, conversations];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, {
                            error: e_1,
                            data: null,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getConversations = getConversations;
function getConversation(id) {
    return __awaiter(this, void 0, void 0, function () {
        var conversation, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.instance.get("/plugin-atlas-ai/convo/".concat(id))];
                case 1:
                    conversation = (_a.sent()).data;
                    if (conversation.error) {
                        throw new Error(conversation.error.message);
                    }
                    return [2 /*return*/, conversation];
                case 2:
                    e_2 = _a.sent();
                    return [2 /*return*/, {
                            error: e_2,
                            data: null,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getConversation = getConversation;
function submitPrompt(_a) {
    var prompt = _a.prompt, cid = _a.cid;
    return __awaiter(this, void 0, void 0, function () {
        var data, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.info("[Iliad] Prompt submitted", {
                        prompt: prompt,
                        cid: cid,
                    });
                    return [4 /*yield*/, exports.instance.post("/plugin-atlas-ai/prompt", {
                            prompt: prompt,
                            cid: cid,
                        })];
                case 1:
                    data = (_b.sent()).data;
                    console.info("[Iliad] Prompt response", {
                        data: data,
                    });
                    if (data.error) {
                        throw new Error(data.error.message);
                    }
                    return [2 /*return*/, data];
                case 2:
                    e_3 = _b.sent();
                    return [2 /*return*/, {
                            error: e_3,
                            data: null,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.submitPrompt = submitPrompt;
function createConversation(_a) {
    var _b;
    var content = _a.content, name = _a.name;
    return __awaiter(this, void 0, void 0, function () {
        var conversationName, generatedName, newConvo, e_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    conversationName = name || "Conversation ".concat(generateConversationId());
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, exports.instance.post("/plugin-atlas-ai/generateName", {
                            prompt: (_b = content === null || content === void 0 ? void 0 : content[0]) === null || _b === void 0 ? void 0 : _b.message,
                        })];
                case 2:
                    generatedName = (_c.sent()).data;
                    if (generatedName.error) {
                        throw new Error(generatedName.error.message);
                    }
                    conversationName = generatedName.data;
                    return [4 /*yield*/, exports.instance.post("/plugin-atlas-ai/convo", {
                            name: conversationName,
                            content: content,
                        })];
                case 3:
                    newConvo = (_c.sent()).data;
                    if (newConvo.error) {
                        throw new Error(newConvo.error.message);
                    }
                    return [2 /*return*/, newConvo];
                case 4:
                    e_4 = _c.sent();
                    return [2 /*return*/, {
                            error: e_4,
                            data: null,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createConversation = createConversation;
function updateConversation(id, _a, overwrite) {
    var content = _a.content, name = _a.name;
    if (overwrite === void 0) { overwrite = false; }
    return __awaiter(this, void 0, void 0, function () {
        var updatedConvoData, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("updateConversation 1", id, content, name, overwrite);
                    content = nullToUndefined(content);
                    name = nullToUndefined(name);
                    console.log("updateConversation 2", id, content, name, overwrite);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.instance.put("/plugin-atlas-ai/convo/".concat(id), {
                            overwrite: overwrite,
                            content: content,
                            name: name,
                        })];
                case 2:
                    updatedConvoData = (_b.sent()).data;
                    if (updatedConvoData.error) {
                        console.error("[Iliad] updateConversation error: ".concat(updatedConvoData.error), updatedConvoData);
                        return [2 /*return*/, {
                                error: updatedConvoData.error,
                                data: null,
                            }];
                    }
                    else {
                        console.info("[Iliad] updateConversation success", updatedConvoData);
                    }
                    return [2 /*return*/, {
                            data: updatedConvoData.data,
                            error: null,
                        }];
                case 3:
                    e_5 = _b.sent();
                    return [2 /*return*/, {
                            error: e_5,
                            data: null,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateConversation = updateConversation;
function getIdFromRoute(route) {
    var _a;
    var id = (_a = route.match.params) === null || _a === void 0 ? void 0 : _a.id;
    return Number(id.split("-")[0]);
}
exports.getIdFromRoute = getIdFromRoute;
function getIdFromPathname(pathname) {
    var lastEl = pathname.split("/").pop();
    if (!lastEl) {
        console.error("[Iliad] getIdFromPathname error: ".concat(pathname));
        return -1;
    }
    return Number(lastEl.split("-")[0]);
}
exports.getIdFromPathname = getIdFromPathname;
exports.utils = {
    getIdFromPathname: getIdFromPathname,
    nullToUndefined: nullToUndefined,
    getIdFromRoute: getIdFromRoute,
    hash64: hash64,
};
exports.atlas = {
    createConversation: createConversation,
    updateConversation: updateConversation,
    getConversations: getConversations,
    getConversation: getConversation,
    submitPrompt: submitPrompt,
};
