import {
  Message,
  CompressedConversation,
  Conversation,
} from "../../@types/atlas";

export function conversationToArray(conversation: string): Array<Message> {
  if (conversation === "") {
    return [];
  }

  const lines = conversation.split("\n");

  let currentSpeaker: string | null = null;
  let dialogues: Array<Message> = [];
  let currentText: string[] = [];
  let originalText: string = "";

  lines.forEach((line) => {
    originalText += line + "\n";
    // Check if the line starts with 'user:' or 'chatgpt:'
    const match = line.match(/(you|chatgpt):\s*(.*)$/i);
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
    } else {
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

export function condenseArray(conversation: Array<Message>): string {
  let result = "";
  for (const { name, message } of conversation) {
    result += `${name}: ${message}\n`;
  }
  return result;
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function compressContent(conversation: Array<Message>): string {
  return JSON.stringify(conversation);
}

export function extractContent(conversation: string): Array<Message> {
  if (!isValidJSON(conversation)) {
    // Legacy support
    return conversationToArray(conversation);
  }
  return JSON.parse(conversation);
}

export function extractConvo(convo: CompressedConversation): Conversation {
  return {
    ...convo,
    content: extractContent(convo.content),
  };
}
