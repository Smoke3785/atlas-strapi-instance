"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitIntoChunks = exports.hash64 = void 0;
var openaiConfig_1 = require("./openaiConfig");
var MAX_CHUNK_SIZE = openaiConfig_1.default.MAX_CHUNK_SIZE;
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
// Function to split content into chunks that fit within the model's token limit
function splitIntoChunks(text) {
    var paragraphs = text.split("\n\n"); // Split into paragraphs for logical chunking
    var chunks = [];
    var currentChunk = "";
    for (var _i = 0, paragraphs_1 = paragraphs; _i < paragraphs_1.length; _i++) {
        var paragraph = paragraphs_1[_i];
        // Check if adding this paragraph would exceed the chunk size
        if ((currentChunk + paragraph).length > MAX_CHUNK_SIZE) {
            chunks.push(currentChunk.trim());
            currentChunk = paragraph; // Start a new chunk
        }
        else {
            currentChunk += "\n\n" + paragraph; // Add paragraph to the current chunk
        }
    }
    // Add the last chunk if not empty
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    // Filter out empty chunks
    return chunks.filter(function (chunk) { return chunk.trim().length > 0; });
}
exports.splitIntoChunks = splitIntoChunks;
