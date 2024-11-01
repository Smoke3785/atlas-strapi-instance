import config from "./openaiConfig";
const { MAX_CHUNK_SIZE } = config;

export function hash64(str) {
  const seed = 0;

  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return `${4294967296 * (2097151 & h2) + (h1 >>> 0)}`;
}

// Function to split content into chunks that fit within the model's token limit
export function splitIntoChunks(text: string): Array<string> {
  const paragraphs = text.split("\n\n"); // Split into paragraphs for logical chunking
  let chunks: Array<string> = [];
  let currentChunk: string = "";

  for (let paragraph of paragraphs) {
    // Check if adding this paragraph would exceed the chunk size
    if ((currentChunk + paragraph).length > MAX_CHUNK_SIZE) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph; // Start a new chunk
    } else {
      currentChunk += "\n\n" + paragraph; // Add paragraph to the current chunk
    }
  }

  // Add the last chunk if not empty
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Filter out empty chunks
  return chunks.filter((chunk: string) => chunk.trim().length > 0);
}
