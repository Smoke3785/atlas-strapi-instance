export default function validatePrompt(prompt: string): string | null {
  if (prompt.length < 1) {
    return "Prompt cannot be empty";
  }

  if (prompt.length > 500) {
    return "Prompt cannot be longer than 500 characters";
  }

  return null;
}

export { validatePrompt };
