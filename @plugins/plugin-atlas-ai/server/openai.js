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
exports.requestOpenAICompletion = exports.OpenAI = void 0;
var helperFunctions_1 = require("./helperFunctions");
var openaiConfig_1 = require("./openaiConfig");
var OpenCache_1 = require("./OpenCache");
var openai_1 = require("openai");
exports.OpenAI = new openai_1.default({
    apiKey: process.env.OPEN_AI_API_KEY,
    project: process.env.OPEN_AI_PROJECT_ID,
});
// CONFIG
var MAX_CHUNK_SIZE = openaiConfig_1.default.MAX_CHUNK_SIZE, MODEL_NAME = openaiConfig_1.default.MODEL_NAME, contentPrompt = openaiConfig_1.default.contentPrompt, optimizationPrompt = openaiConfig_1.default.optimizationPrompt;
function requestOpenAICompletion(data, strapi) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var hashKey, finalData, cachedData, processedChunks, chunks, i, chunk, content, response, optimized, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    hashKey = OpenCache_1.default.generateHashKey(data);
                    // Restore from cache if available
                    funcBody: {
                        if (OpenCache_1.default.has(hashKey)) {
                            cachedData = OpenCache_1.default.get(hashKey);
                            finalData = cachedData === null || cachedData === void 0 ? void 0 : cachedData.value;
                            break funcBody;
                        }
                    }
                    processedChunks = [];
                    chunks = (0, helperFunctions_1.splitIntoChunks)(data);
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!(i < chunks.length)) return [3 /*break*/, 6];
                    chunk = chunks[i];
                    content = "".concat(contentPrompt).concat(chunk);
                    // Append prompt to content if at the end.
                    if (i === chunks.length - 1) {
                        content += "\n\nEnd of the article.";
                    }
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, exports.OpenAI.chat.completions.create({
                            model: MODEL_NAME,
                            messages: [
                                {
                                    content: optimizationPrompt,
                                    role: "system",
                                },
                                {
                                    content: content,
                                    role: "user",
                                },
                            ],
                            temperature: 0.3, // Lower temperature for more deterministic results
                        })];
                case 3:
                    response = _e.sent();
                    optimized = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
                    if (!optimized) {
                        throw new Error("Failed to optimize the article.");
                    }
                    processedChunks.push(optimized);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    strapi.log.error("Failed to process chunk ".concat(i, ": ").concat(error_1));
                    return [3 /*break*/, 6];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (processedChunks.length === 0) {
                        strapi.log.error("Failed to process any chunks.");
                        return [2 /*return*/, {
                                error: "Failed to process any chunks.",
                                data: null,
                            }];
                        // throw new Error("Failed to process any chunks.");
                    }
                    finalData = processedChunks.join("\n\n");
                    return [2 /*return*/, {
                            data: finalData,
                            error: null,
                        }];
            }
        });
    });
}
exports.requestOpenAICompletion = requestOpenAICompletion;
