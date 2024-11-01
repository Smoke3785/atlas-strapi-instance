// Hooks / Functions
import { useState, useEffect, useRef, useCallback } from "react";
import { useIntl } from "react-intl";

// Utils
import { instance, atlas, utils } from "../../utils/frontendUtils";
import { useHistory } from "react-router-dom";
import type {
  Message,
  Conversation,
  StandardResponse,
  CurrentConversation,
} from "../../../../@types/atlas";

// Icons
import {
  PaperPlane,
  Command,
  Cog,
  Picture,
  PlusCircle,
  ArrowUp,
} from "@strapi/icons";

// UI Library Components
import { Box, Grid, Button, GridItem } from "@strapi/design-system";

import AtlasInput from "../AtlasInput";
// UI Components
// import { Response } from "./response";
// import Integration from "../Integration";
// import LoadingOverlay from "../Loading";
// import CustomTab from "./tab";
// import Help from "../Help";

// Types
import type { RouteComponentProps } from "react-router-dom";

type Context = {
  dynamic: string[];
  static: string[];
} | null;

type Months =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

type PromptType = "text" | "picture";

type ConvoTabProps = {
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  convo: Conversation;
};

type SortedConvos = { [key: number]: Conversation[] } & {
  // Years
  [key in Months]: Conversation[];
} & {
  // Months
  today: Conversation[];
  yesterday: Conversation[];
  thisWeek: Conversation[];
  thisMonth: Conversation[];
};

// Helper Functions
export function getTimeLabel(key: keyof SortedConvos): string {
  const labels: any = {
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "Past 7 Days",
    thisMonth: "Past 30 Days",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  };

  return labels?.[key] || key;
}

export function formatConvos(
  convos: Array<Conversation>
): Partial<SortedConvos> {
  const sortedConvos: Partial<SortedConvos> = {};

  // Helper functions for date calculations
  const startOfDay = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfWeek = (date: Date): Date => {
    const dayOfWeek = date.getDay();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - dayOfWeek
    );
  };

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const thisWeekStart = startOfWeek(today);
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Categorize conversations into the relevant buckets
  convos.forEach((convo) => {
    const convoDate = new Date(convo.updatedAt);
    const startOfConvoDay = startOfDay(convoDate);

    // Categorize by "today", "yesterday", "this week", and "this month" in priority order
    if (startOfConvoDay.getTime() === today.getTime()) {
      if (!sortedConvos.today) sortedConvos.today = [];
      sortedConvos.today.push(convo);
      return;
    }

    if (startOfConvoDay.getTime() === yesterday.getTime()) {
      if (!sortedConvos.yesterday) sortedConvos.yesterday = [];
      sortedConvos.yesterday.push(convo);
      return;
    }

    if (startOfConvoDay >= thisWeekStart) {
      if (!sortedConvos.thisWeek) sortedConvos.thisWeek = [];
      sortedConvos.thisWeek.push(convo);
      return;
    }

    if (convoDate >= thisMonthStart) {
      if (!sortedConvos.thisMonth) sortedConvos.thisMonth = [];
      sortedConvos.thisMonth.push(convo);
      return;
    }

    // Sort by year (if it doesn't fit into today, yesterday, this week, or this month)
    const year = convoDate.getFullYear();
    if (!sortedConvos[year]) {
      sortedConvos[year] = [];
    }
    (sortedConvos[year] as Conversation[]).push(convo);

    // Sort by month
    const month: Months = convoDate.toLocaleString("en-US", {
      month: "long",
    }) as Months;
    if (!sortedConvos[month]) {
      sortedConvos[month] = [];
    }
    (sortedConvos[month] as Conversation[]).push(convo);
  });

  return sortedConvos;
}

function typeInt(value: string): number {
  function isMonth(value: string): boolean {
    return months.includes(value.toLowerCase());
  }

  function isYear(value: string): boolean {
    return !isNaN(Number(value));
  }

  // console.log(`[Iliad] typeInt: ${value} is being checked...`);

  if (isYear(value)) {
    return -1;
  }
  // console.log(`[Iliad] typeInt: ${value} is not a year`);

  if (isMonth(value)) {
    return 0;
  }
  // console.log(`[Iliad] typeInt: ${value} is not a month`);

  // console.log(`[Iliad] typeInt: ${value} must be a day string`);

  return 1;
}

// Staging Components
export const ConvoTabText = ({ convo, onDelete, onClick }: ConvoTabProps) => {
  return (
    <div
      onClick={() => {
        onClick(convo.id);
      }}
      className="convoTabTextContainer"
    >
      <p className="convoTabText">{convo.name}</p>
      <div className="contextButtonContainer">
        <p
          onClick={() => {
            onDelete(convo.id);
          }}
          className="ctxLabel"
        >
          X
        </p>
      </div>
    </div>
  );
};

// Notes
//  - there's no ability to actually create a new chat. Clicking the button will simply take them to the 'empty' chat page where their initial message will create a new chat as a side effect.

// Local Types
type CreateNewPageProps = {
  routeComponentProps: RouteComponentProps;
  refetchConversations: () => void;
};

export default function CreateNewPage({
  routeComponentProps,
  refetchConversations,
}: CreateNewPageProps) {
  // Hooks
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Dashboard State
  const [convos, setConvos] = useState<Array<Conversation>>([]); // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
  const [loading, setLoading] = useState(false); // Loading state
  const [prompt, setPrompt] = useState(""); // The user's input
  const [error, setError] = useState(""); // Error message, if any

  // Handles the change of the prompt input
  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(e.target.value);
      setError("");
    },
    []
  );

  // Declaratively-titled function
  const clearError = useCallback((): void => {
    setError("");
  }, []);

  const reportError = useCallback((intlId: string): Error => {
    // This is a little sketchy, may refactor
    const fMsg = formatMessage({ id: intlId, defaultMessage: intlId });
    console.warn(`[Iliad] Error: ${intlId}`);
    setError(fMsg);

    return new Error(fMsg);
  }, []);

  const handlePromptSubmission = useCallback(
    async (prompt: string): Promise<string | null> => {
      console.log(`[Iliad] Prompt: ${prompt}`);

      let finalOutput = "Function body not executed";

      // Get current conversation before proceeding
      let responseMessage: Message;
      let promptMessage: Message;

      setLoading(true);

      functionBody: {
        const { data: promptResponse, error } = await atlas.submitPrompt({
          prompt,
        });
        console.log(`[Iliad] Prompt submitted`, {
          promptResponse,
          error,
        });

        if (error) {
          finalOutput = error.message;
          break functionBody;
        }

        // Turn our data into a message
        responseMessage = promptResponse;
        promptMessage = {
          message: prompt,
          name: "you",
        };

        let updatedConversation: Conversation;

        // If there's no current conversation, we need to create one.
        const { data: newConvo, error: _error } =
          await atlas.createConversation({
            content: [promptMessage, responseMessage],
          });

        if (_error) {
          finalOutput = _error.message;
          break functionBody;
        }

        // Update the conversation state with the new conversation
        refetchConversations();

        const ncPath = `${newConvo.id}-${utils.hash64(`${newConvo.id}`)}`;
        const rootPath = routeComponentProps.match.path;

        // Now redirect to the conversation page
        history.push(`${rootPath}/conversations/${ncPath}`);
      }

      setLoading(false);
      return null; // No error
    },
    [prompt]
  );

  return (
    <div
      style={{
        flexBasis: 0,
        flexGrow: 1,
      }}
      className="superMain create"
    >
      <div>
        <div className="stickyInputContainer">
          <h1 className="createSplashText">What can I help with?</h1>
          <AtlasInput onSubmit={handlePromptSubmission} />
        </div>
      </div>
    </div>
  );
}
