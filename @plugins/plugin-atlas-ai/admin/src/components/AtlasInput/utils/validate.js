"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePrompt = void 0;
function validatePrompt(prompt) {
    if (prompt.length < 1) {
        return "Prompt cannot be empty";
    }
    if (prompt.length > 500) {
        return "Prompt cannot be longer than 500 characters";
    }
    return null;
}
exports.default = validatePrompt;
exports.validatePrompt = validatePrompt;
