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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractConvo = exports.extractContent = exports.compressContent = exports.isValidJSON = exports.condenseArray = exports.conversationToArray = void 0;
function conversationToArray(conversation) {
    if (conversation === "") {
        return [];
    }
    var lines = conversation.split("\n");
    var currentSpeaker = null;
    var dialogues = [];
    var currentText = [];
    var originalText = "";
    lines.forEach(function (line) {
        originalText += line + "\n";
        // Check if the line starts with 'user:' or 'chatgpt:'
        var match = line.match(/(you|chatgpt):\s*(.*)$/i);
        if (match) {
            // If a new speaker starts speaking, and there is already a current speaker,
            // push the current dialogue to dialogues array
            if (currentSpeaker) {
                dialogues.push({
                    name: currentSpeaker,
                    message: currentText.join("\n"), // Preserve new lines
                });
                currentText = [];
            }
            currentSpeaker = match[1].toLowerCase();
            currentText.push(match[2]);
        }
        else {
            // If the same speaker continues or line does not start with a known speaker,
            // append the line to the current text.
            currentText.push(line);
        }
    });
    // Add the last spoken dialogue to the array if it exists
    if (currentSpeaker && currentText.length) {
        dialogues.push({
            name: currentSpeaker,
            message: currentText.join("\n"), // Preserve new lines
        });
    }
    return dialogues;
}
exports.conversationToArray = conversationToArray;
function condenseArray(conversation) {
    var result = "";
    for (var _i = 0, conversation_1 = conversation; _i < conversation_1.length; _i++) {
        var _a = conversation_1[_i], name_1 = _a.name, message = _a.message;
        result += "".concat(name_1, ": ").concat(message, "\n");
    }
    return result;
}
exports.condenseArray = condenseArray;
function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isValidJSON = isValidJSON;
function compressContent(conversation) {
    return JSON.stringify(conversation);
}
exports.compressContent = compressContent;
function extractContent(conversation) {
    if (!isValidJSON(conversation)) {
        // Legacy support
        return conversationToArray(conversation);
    }
    return JSON.parse(conversation);
}
exports.extractContent = extractContent;
function extractConvo(convo) {
    return __assign(__assign({}, convo), { content: extractContent(convo.content) });
}
exports.extractConvo = extractConvo;
