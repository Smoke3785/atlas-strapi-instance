// Function to transform the sender's name
export const transformName = (name: string, user: string = "you"): string => {
  return name === "you" ? user : { assistant: "Atlas AI" }[name] || name;
};

// Function to check if the message is from AI
export const isFromAI = (name: string): boolean => {
  return ["Atlas AI", "chatgpt", "assistant"].includes(name);
};

export const responseUtils = {
  transformName,
  isFromAI,
};
