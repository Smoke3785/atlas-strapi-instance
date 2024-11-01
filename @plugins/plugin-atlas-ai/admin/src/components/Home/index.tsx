// Hooks / Functions
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIntl } from "react-intl";

// Utils
import { instance, atlas, utils } from "../../utils/frontendUtils";
import type {
  Message,
  Conversation,
  StandardResponse,
  CurrentConversation,
} from "../../../../@types/atlas";

// Icons
import { PaperPlane, Command, Cog, Picture, PlusCircle } from "@strapi/icons";

// UI Library Components
import {
  Box,
  Tab,
  Tabs,
  Card,
  Main,
  Grid,
  Stack,
  SubNav,
  Layout,
  Button,
  CardBody,
  TabGroup,
  GridItem,
  TabPanel,
  TabPanels,
  TextInput,
  SubNavLink,
  Typography,
  CardContent,
  ActionLayout,
  HeaderLayout,
  SubNavHeader,
  SingleSelect,
  SubNavSection,
  ContentLayout,
  SubNavSections,
  SingleSelectOption,
} from "@strapi/design-system";

// UI Components
import { Response } from "./response";
// import Integration from "../Integration";
// import LoadingOverlay from "../Loading";
// import CustomTab from "./tab";
// import Help from "../Help";

// Types

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

export default function Home() {
  // Hooks
  const { formatMessage } = useIntl();

  // Dashboard State
  const [currentConvoId, setCurrentConvoId] = useState<number | null>(null);
  const [convos, setConvos] = useState<Array<Conversation>>([]); // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
  const [user_name, setUserName] = useState("you"); // future proofing here
  const [loading, setLoading] = useState(false); // Loading state
  const [prompt, setPrompt] = useState(""); // The user's input
  const [error, setError] = useState(""); // Error message, if any

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Event Handlers

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

  const handleCreateTab = async () => {
    const defaultConvoName = formatMessage({
      id: "strapi-supergpt.homePage.convo.new.name",
    });
    const { data: newConvo } = await instance.post(`/plugin-atlas-ai/convo`, {
      name: `${defaultConvoName} ${convos.length + 1}`,
    });

    setConvos((prevConvos) => [...prevConvos, newConvo]);
    setCurrentConvoId(newConvo.id);
  };

  const getCurrentConversation = useCallback(():
    | CurrentConversation
    | undefined => {
    const matching = convos.find((convo) => convo.id === currentConvoId);

    if (!matching) {
      return;
    }

    return matching as CurrentConversation;
  }, [convos, currentConvoId]);

  // This is where the error is occurring
  const updateConversationState = useCallback(
    (updatedConversation: CurrentConversation | Conversation) => {
      setConvos((prevConvos) => {
        let _prevConvos = [...prevConvos];
        // If no conversations exist, we can't update anything.
        // Just return the updated conversation as the only conversation.
        if (prevConvos.length === 0) {
          return [updatedConversation];
        }

        if (!updatedConversation.id) {
          console.warn(
            `[Iliad] updateConversationState: updatedConversation has no id`,
            { updatedConversation }
          );
          return _prevConvos;
        }
        // Otherwise, find the index of the conversation to update
        const index = prevConvos.findIndex(
          (convo) => convo?.id === updatedConversation.id
        );

        // If it doesn't exist, add it to the list of conversations
        if (index === -1) {
          return [...prevConvos, updatedConversation];
        }

        // Otherwise, update the conversation in place
        _prevConvos[index] = updatedConversation;

        // Return the updated list of conversations
        return _prevConvos;
      });
    },
    [getCurrentConversation, currentConvoId, user_name, setConvos, convos]
  );

  const handlePromptSubmission = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: PromptType = "text"
    ): Promise<StandardResponse> => {
      e.preventDefault(); // We don't need this event to propagate
      clearError(); // Clear any existing errors - this is a new submission

      console.log(`[Iliad] Prompt: ${prompt}`);

      let finalOutput: StandardResponse = {
        error: new Error("Function body not executed"),
        data: null,
      };

      // Get current conversation before proceeding
      let currentConversation = getCurrentConversation();
      let responseMessage: Message;
      let promptMessage: Message;

      setLoading(true);

      console.log(`[Iliad] About to enter function body`, {
        currentConversation,
        currentConvoId,
        user_name,
        prompt,
      });

      functionBody: {
        // If the prompt state is empty, we can't proceed
        if (!prompt) {
          finalOutput = {
            error: reportError("strapi-supergpt.homePage.error.promptRequired"),
            data: null,
          };
          break functionBody;
        }

        const { data: promptResponse, error } = await atlas.submitPrompt({
          cid: utils.nullToUndefined(currentConvoId),
          prompt,
        });
        console.log(`[Iliad] Prompt submitted`, {
          promptResponse,
          error,
        });

        if (error) {
          finalOutput = {
            error: reportError(error.message),
            data: null,
          };
          break functionBody;
        }

        // Turn our data into a message
        responseMessage = promptResponse;
        promptMessage = {
          message: prompt,
          name: user_name,
        };

        console.log(`[Iliad] messages assembled`, {
          promptResponse,
          error,
        });

        let updatedConversation: Conversation;

        // Okay. Now we have our response.
        if (currentConversation && currentConvoId) {
          // If there's a current conversation, we need to update it.
          const { data: updatedConvo, error } = await atlas.updateConversation(
            currentConvoId,
            {
              // NOTE: This part is suspect, because it assumes the client has the full conversation in memory.
              content: [promptMessage, responseMessage],
            }
          );

          if (error) {
            finalOutput = {
              error: reportError(error.message),
              data: null,
            };
            break functionBody;
          }

          updatedConversation = updatedConvo as CurrentConversation;
        } else {
          // If there's no current conversation, we need to create one.
          const { data: newConvo, error } = await atlas.createConversation({
            content: [promptMessage, responseMessage],
          });

          if (error) {
            finalOutput = {
              error: reportError(error.message),
              data: null,
            };
            break functionBody;
          }

          updatedConversation = newConvo as CurrentConversation;

          // If we created a new conversation, we need to add it to the list of conversations
          setConvos((prevConvos) => [...prevConvos, updatedConversation]);
        }

        console.log(`[Iliad] Conversation updated`, {
          updatedConversation,
        });

        // Now we have responded to the user's prompt and created a new conversation if necessary.
        // Let's update the state with the new conversation.
        updateConversationState(updatedConversation);
        setCurrentConvoId(updatedConversation.id);
      }

      setLoading(false);
      return finalOutput;
    },
    [prompt, currentConvoId, user_name, getCurrentConversation]
  );

  const deleteConversation = useCallback(
    async (id: number): Promise<StandardResponse<null>> => {
      await instance.delete(`/plugin-atlas-ai/convo/${id}`);
      setConvos((prevConvos) => {
        const updatedConvos = prevConvos.filter((convo) => convo.id !== id);
        return updatedConvos;
      });

      return {
        error: null,
        data: null,
      };
    },
    []
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const refetchConversations = useCallback(async () => {
    const { data: _conversations } = await instance.get<Array<Conversation>>(
      "/plugin-atlas-ai/convos"
    );

    if (_conversations.length > 0) {
      setConvos(_conversations);
    } else {
      console.warn(`[Iliad] No conversations found`);
    }

    return;
  }, []);

  useEffect(() => {
    if (convos.length === 0) {
      refetchConversations();
    }
  }, [setConvos]);

  useEffect(() => {
    console.log({ convos, formattedConvos });
  }, [convos]);

  // Derived State
  const formattedConvos = formatConvos(convos);
  const currentConversation = getCurrentConversation();

  return (
    <Layout
      data-component="ism-layout"
      style={{
        display: "flex",
      }}
      className="mainContainer"
    >
      <div id="mainContainerHas" />
      {/* {context ? <div>{JSON.stringify(context)}</div> : <p>Loading data...</p>} */}
      <SubNav aria-label="Conversations sub nav">
        {/* <SubNavHeader label="Conversations" /> */}
        <SubNavSections>
          {Object.entries(formattedConvos)
            .sort(([keyA], [keyB]) => {
              const isSameType = typeInt(keyA) === typeInt(keyB);
              const dayStrings = [
                "today",
                "yesterday",
                "thisWeek",
                "thisMonth",
              ];

              if (isSameType) {
                const type = ["year", "month", "day"][typeInt(keyA + 1)];

                // If both are years, compare numerically
                if (type === "year") {
                  return Number(keyA) - Number(keyB);
                }

                // If both are months, compare by index of month
                if (type === "month") {
                  return (
                    months.indexOf(keyA.toLowerCase()) -
                    months.indexOf(keyB.toLowerCase())
                  );
                }

                if (type === "day") {
                  return dayStrings.indexOf(keyA) - dayStrings.indexOf(keyB);
                }
              }

              // console.log(
              //   { keyA, keyB },
              //   typeInt(keyA),
              //   typeInt(keyB),
              //   typeInt(keyA) - typeInt(keyB)
              // );

              return typeInt(keyA) - typeInt(keyB);
            })
            .reverse()
            .map(([key, convos], idx) => {
              const label = getTimeLabel(key as keyof SortedConvos);

              return (
                <SubNavSection
                  className="subNavSection"
                  key={`sbn-${key}`}
                  label={label}
                >
                  {convos?.map((convo: Conversation, _idx: number) => {
                    return (
                      <ConvoTabText
                        data-active={(currentConvoId === convo.id).toString()}
                        onDelete={deleteConversation}
                        onClick={setCurrentConvoId}
                        key={`ctt-${idx}-${_idx}`}
                        convo={convo}
                      />
                    );
                  })}
                </SubNavSection>
              );
            })}
        </SubNavSections>
      </SubNav>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
        }}
        className="superMain"
      >
        <Main className="realMain">
          <ContentLayout>
            <header className="atlasHeader">
              <h1 className="atlasAiText">Atlas_4o-mini</h1>
            </header>
            <main className="contentContainer">
              {/* {currentConvoId === null ? () : ()} */}
              {currentConversation && (
                <div className={"chatItemsContainer"}>
                  {currentConversation?.content &&
                    currentConversation.content.map((response, index) => {
                      return (
                        // @ts-ignore
                        <Response key={`${index}`}>{response}</Response>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </main>
          </ContentLayout>
        </Main>
        <div className="stickyInputContainer">
          <Box>
            <form
              id="chatForm"
              onSubmit={(e: any) => {
                e.preventDefault();
                handlePromptSubmission(e);
              }}
            >
              <Grid
                data-component="real-input-container"
                className="realInputContainer"
                spacing={1}
                gap={2}
                paddingTop={4}
              >
                <GridItem col={11}>
                  <TextInput
                    id="chatInput"
                    placeholder={formatMessage({
                      id: "strapi-supergpt.homePage.prompt.placeholder",
                    })}
                    aria-label="Content"
                    name="prompt"
                    error={error}
                    onChange={handlePromptChange}
                    value={prompt}
                    disabled={loading}
                    onPaste={(e: any) => {
                      // e.preventDefault();
                      setError("");
                    }}
                  />
                </GridItem>
                <GridItem
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    size="L"
                    name="prompt"
                    startIcon={<PaperPlane />}
                    value="prompt"
                    loading={loading}
                    onClick={handlePromptSubmission}
                  >
                    {formatMessage({
                      id: "strapi-supergpt.homePage.prompt.button",
                    })}
                  </Button>
                </GridItem>
              </Grid>
            </form>
          </Box>
        </div>
      </div>
    </Layout>
    // <div >
    // </div>
  );
}
