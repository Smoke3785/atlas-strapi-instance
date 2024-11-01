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
var jsdom_1 = require("jsdom");
var openai_1 = require("./openai");
function extractTextFromHtml(htmlString) {
    var _a, _b, _c;
    // Parse the HTML string into a virtual DOM
    var dom = new jsdom_1.JSDOM(htmlString);
    // Use textContent to get the text inside the body tag
    var textContent = ((_c = (_b = (_a = dom === null || dom === void 0 ? void 0 : dom.window) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.textContent) || "";
    // Optionally, you can trim whitespace and normalize spaces
    return textContent.trim().replace(/\s+/g, " ");
}
// LLM
function requestLlmFieldGeneration(_a, strapi) {
    var _b, _c;
    var contentType = _a.contentType, entryId = _a.entryId, field = _a.field, data = _a.data;
    return __awaiter(this, void 0, void 0, function () {
        var sanitizedData, endpoint, callbackData, existingSnippet, _d, summarizedData, error, snippetData;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    sanitizedData = extractTextFromHtml(data);
                    endpoint = "/api/llm-snippets";
                    callbackData = {
                        contentType: contentType,
                        entryId: entryId,
                        field: field,
                    };
                    strapi.log.debug(JSON.stringify({ contentType: contentType, entryId: entryId, field: field, data: data }));
                    return [4 /*yield*/, strapi.entityService.findMany("api::llm-snippet.llm-snippet", {
                            filters: {
                                contentType: contentType,
                                entryId: entryId,
                                field: field,
                            },
                        })];
                case 1:
                    existingSnippet = ((_c = (_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id) || null;
                    return [4 /*yield*/, (0, openai_1.requestOpenAICompletion)(sanitizedData, strapi)];
                case 2:
                    _d = _e.sent(), summarizedData = _d.data, error = _d.error;
                    if (error) {
                        strapi.log.error("Failed to process chunk ".concat(field, ": ").concat(error));
                        return [2 /*return*/];
                    }
                    strapi.log.debug(JSON.stringify({
                        data: sanitizedData,
                        summarizedData: summarizedData,
                        callbackData: callbackData,
                        endpoint: endpoint,
                    }));
                    if (!existingSnippet) return [3 /*break*/, 4];
                    endpoint += "/".concat(existingSnippet);
                    return [4 /*yield*/, strapi.entityService.update("api::llm-snippet.llm-snippet", existingSnippet, {
                            data: {
                                data: summarizedData,
                            },
                        })];
                case 3:
                    snippetData = _e.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, strapi.entityService.create("api::llm-snippet.llm-snippet", {
                        data: {
                            entryId: Number(entryId),
                            data: summarizedData,
                            contentType: contentType,
                            field: field,
                        },
                    })];
                case 5:
                    // Otherwise, create a new snippet
                    snippetData = _e.sent();
                    _e.label = 6;
                case 6:
                    strapi.log.info("[Iliad] Created/updated LLM snippet for ".concat(field));
                    strapi.log.debug(JSON.stringify(snippetData));
                    return [2 /*return*/];
            }
        });
    });
}
function handleUpdateLLM(_a, strapi) {
    var _b;
    var model = _a.model, params = _a.params, result = _a.result;
    var entryId = ((_b = params === null || params === void 0 ? void 0 : params.data) === null || _b === void 0 ? void 0 : _b.id) || (result === null || result === void 0 ? void 0 : result.id);
    var contentType = model.uid;
    var llmFieldKeys = Object.entries(model.attributes).flatMap(function (_a) {
        var key = _a[0], generateLlmSnippet = _a[1].generateLlmSnippet;
        return generateLlmSnippet ? key : [];
    });
    var llmFields = llmFieldKeys.map(function (key) {
        var _a;
        return [
            key,
            ((_a = params === null || params === void 0 ? void 0 : params.data) === null || _a === void 0 ? void 0 : _a[key]) || null,
        ];
    });
    if (!llmFields.length) {
        return;
    }
    for (var _i = 0, llmFields_1 = llmFields; _i < llmFields_1.length; _i++) {
        var _c = llmFields_1[_i], field = _c[0], data = _c[1];
        requestLlmFieldGeneration({
            contentType: contentType,
            entryId: entryId,
            field: field,
            data: data,
        }, strapi);
    }
}
exports.default = (function (_a) {
    var strapi = _a.strapi;
    if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db))
        return;
    // bootstrap phase
    strapi.db.lifecycles.subscribe({
        afterCreate: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // fs.writeFileSync("afterCreate.json", JSON.stringify(event));
                    handleUpdateLLM(event, strapi);
                    return [2 /*return*/];
                });
            });
        },
        afterUpdate: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // fs.writeFileSync("afterUpdate.json", JSON.stringify(event));
                    handleUpdateLLM(event, strapi);
                    return [2 /*return*/];
                });
            });
        },
    });
});
