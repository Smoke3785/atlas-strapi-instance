"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseUtils = exports.isFromAI = exports.transformName = void 0;
// Function to transform the sender's name
var transformName = function (name, user) {
    if (user === void 0) { user = "you"; }
    return name === "you" ? user : { assistant: "Atlas AI" }[name] || name;
};
exports.transformName = transformName;
// Function to check if the message is from AI
var isFromAI = function (name) {
    return ["Atlas AI", "chatgpt", "assistant"].includes(name);
};
exports.isFromAI = isFromAI;
exports.responseUtils = {
    transformName: exports.transformName,
    isFromAI: exports.isFromAI,
};
