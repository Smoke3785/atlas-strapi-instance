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
var utils_1 = require("../utils");
var convoObject = "plugin::plugin-atlas-ai.conversation";
exports.default = (function (_a) {
    var strapi = _a.strapi;
    return ({
        createConvo: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, name, content, convo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db))
                                return [2 /*return*/, {
                                        error: new Error("Strapi not initialized"),
                                        data: null,
                                    }];
                            _a = ctx.request.body, name = _a.name, content = _a.content;
                            return [4 /*yield*/, strapi.db
                                    .query(convoObject)
                                    .create({
                                    data: {
                                        content: (0, utils_1.compressContent)(content),
                                        userId: ctx.state.user.id,
                                        name: name,
                                    },
                                })];
                        case 1:
                            convo = _b.sent();
                            if (!convo) {
                                return [2 /*return*/, {
                                        error: new Error("Failed to create conversation"),
                                        data: null,
                                    }];
                            }
                            return [2 /*return*/, {
                                    error: null,
                                    data: (0, utils_1.extractConvo)(convo),
                                }];
                    }
                });
            });
        },
        readConvo: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var id, convo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db))
                                return [2 /*return*/];
                            id = ctx.params.id;
                            return [4 /*yield*/, strapi.db.query(convoObject).findOne({
                                    select: ["content"],
                                    where: {
                                        id: id,
                                        userId: ctx.state.user.id,
                                    },
                                })];
                        case 1:
                            convo = _a.sent();
                            return [2 /*return*/, (0, utils_1.extractContent)(convo.content)];
                    }
                });
            });
        },
        getConvo: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var id, convo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            strapi.log.debug("Getting convo with id: ".concat(ctx.params.id, " and user id ").concat(ctx.state.user.id));
                            if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db)) {
                                return [2 /*return*/, {
                                        error: new Error("Strapi not initialized"),
                                        data: null,
                                    }];
                            }
                            id = ctx.params.id;
                            return [4 /*yield*/, strapi.db.query(convoObject).findOne({
                                    select: ["content", "id", "name", "createdAt", "updatedAt"],
                                    where: {
                                        userId: ctx.state.user.id,
                                        id: id,
                                    },
                                })];
                        case 1:
                            convo = _a.sent();
                            strapi.log.debug("convo: ");
                            strapi.log.debug(convo);
                            return [2 /*return*/, {
                                    data: (0, utils_1.extractConvo)(convo),
                                    error: null,
                                }];
                    }
                });
            });
        },
        readConvoNames: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var convos, mockCTX, conversation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db))
                                return [2 /*return*/];
                            return [4 /*yield*/, strapi.db.query(convoObject).findMany({
                                    select: ["id", "name", "createdAt", "updatedAt"],
                                    where: {
                                        $not: {
                                            name: null,
                                        },
                                        userId: ctx.state.user.id,
                                    },
                                })];
                        case 1:
                            convos = _a.sent();
                            convos = convos.map(function (convo) {
                                return __assign(__assign({}, convo), { content: [] });
                            });
                            if (!(convos.length > 0)) return [3 /*break*/, 3];
                            mockCTX = ctx;
                            mockCTX.params.id = convos[0].id;
                            return [4 /*yield*/, this.readConvo(mockCTX)];
                        case 2:
                            conversation = _a.sent();
                            convos[0].content = conversation;
                            _a.label = 3;
                        case 3: return [2 /*return*/, convos];
                    }
                });
            });
        },
        updateConvo: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var id, _a, name, content, _b, overwrite, finalContent, oldConvo, _oldContent, convo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db)) {
                                return [2 /*return*/, {
                                        error: new Error("Strapi not initialized"),
                                        data: null,
                                    }];
                            }
                            id = ctx.params.id;
                            _a = ctx.request.body, name = _a.name, content = _a.content, _b = _a.overwrite, overwrite = _b === void 0 ? false : _b;
                            finalContent = content;
                            if (!!overwrite) return [3 /*break*/, 2];
                            return [4 /*yield*/, strapi.db.query(convoObject).findOne({
                                    select: ["content"],
                                    where: {
                                        userId: ctx.state.user.id,
                                        id: id,
                                    },
                                })];
                        case 1:
                            oldConvo = _c.sent();
                            _oldContent = (0, utils_1.extractContent)(oldConvo.content);
                            finalContent = __spreadArray(__spreadArray([], _oldContent, true), content, true);
                            _c.label = 2;
                        case 2: return [4 /*yield*/, strapi.db.query(convoObject).update({
                                where: {
                                    id: id,
                                },
                                data: {
                                    name: name,
                                    content: (0, utils_1.compressContent)(finalContent),
                                },
                            })];
                        case 3:
                            convo = _c.sent();
                            return [2 /*return*/, {
                                    data: (0, utils_1.extractConvo)(convo),
                                    error: null,
                                }];
                    }
                });
            });
        },
        deleteConvo: function (ctx) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var id;
                return __generator(this, function (_b) {
                    strapi.log.error("deleteconvo");
                    if (!(strapi === null || strapi === void 0 ? void 0 : strapi.db)) {
                        strapi.log.error("Database connection is not initialized.");
                        return [2 /*return*/];
                    }
                    id = ctx.params.id;
                    if (!id) {
                        strapi.log.error("ID parameter is missing.");
                        return [2 /*return*/];
                    }
                    try {
                        (_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.delete("plugin::plugin-atlas-ai.conversation", id);
                        strapi.log.info("Conversation with ID: ".concat(id, " deleted successfully."));
                        // if (!convo) {
                        //   console.warn(`No conversation found with ID: ${id}`);
                        // } else {
                        //   console.log(`Conversation with ID: ${id} deleted successfully.`);
                        // }
                        // return convo;
                    }
                    catch (error) {
                        strapi.log.error("Error deleting conversation with ID: ".concat(id), error);
                        throw error;
                    }
                    return [2 /*return*/];
                });
            });
        },
    });
});
