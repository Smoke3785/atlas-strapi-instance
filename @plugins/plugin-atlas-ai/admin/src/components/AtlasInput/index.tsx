// React
import { Box, Grid, Button, GridItem, TextInput } from "@strapi/design-system";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AtlasInputRoot, AtlasGrid, SendButton } from "./styled";
import { validatePrompt } from "./utils/validate";

// Icons
import { PaperPlane } from "@strapi/icons";

type SyncOrAsync<T> = T | Promise<T>;

type AISubmitEvent =
  | React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type AtlasInputProps = {
  onSubmit: (prompt: string) => SyncOrAsync<string | null>;
  className?: string;
};

export default function AtlasInput({ onSubmit }: AtlasInputProps) {
  const [inputState, setInputState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateError = useCallback((error: string) => {
    console.error(`[AtlasInput] Error: ${error}`);
    setError(error.toString());
  }, []);

  const handleSubmission = useCallback(
    async (e: AISubmitEvent) => {
      e.preventDefault();

      const prompt = `${inputState.trim()}`;
      setLoading(true);

      functionBody: {
        let validationError = validatePrompt(prompt);
        if (validationError) {
          updateError(validationError);
          break functionBody;
        }

        // Clear input state
        setInputState("");

        let submitError = await onSubmit(prompt);
        if (submitError) {
          updateError(submitError);
          break functionBody;
        }
      }

      setLoading(false);
    },
    [inputState]
  );

  return (
    <AtlasInputRoot>
      <form onSubmit={handleSubmission}>
        <AtlasGrid gap={2} paddingTop={4}>
          <GridItem col={11}>
            <TextInput
              placeholder={"Message Atlas AI"}
              aria-label="Content"
              value={inputState}
              disabled={loading}
              id="chatInput"
              name="prompt"
              error={error}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setInputState(e.target.value);
                setError("");
              }}
            />
          </GridItem>
          <GridItem>
            <SendButton
              startIcon={<PaperPlane />}
              disabled={loading}
              loading={loading}
              type="submit"
            >
              Send
            </SendButton>
          </GridItem>
        </AtlasGrid>
      </form>
    </AtlasInputRoot>
  );
}

export { AtlasInput };
