// Hooks / Functions
import { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

// Utils
import { instance, atlas, utils } from "../../utils/frontendUtils";
import type {
  Message,
  Conversation,
  StandardResponse,
} from "../../../../@types/atlas";

// Icons
import {
  PaperPlane,
  Command,
  Cog,
  Picture,
  PlusCircle,
  NumberList,
  // MinusCircle,
} from "@strapi/icons";

import { Switch, Route, RouteComponentProps, Link } from "react-router-dom";
import { AnErrorOccurred } from "@strapi/helper-plugin";

import ConversationPage from "../ConversationPage";

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
  Loader,
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
import CreateNewPage from "../CreateNewPage";
import { Paragraph } from "@strapi/icons";
import { Minus } from "@strapi/icons";
import { More } from "@strapi/icons";

// UI Components
import { ConversationLabelButton } from "../ConversationLabelButton";

// Types
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
  root: string;
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

  if (isYear(value)) {
    return -1;
  }

  if (isMonth(value)) {
    return 0;
  }

  return 1;
}

function superSortConvos(formattedConvos: Partial<SortedConvos>) {
  return Object.entries(formattedConvos)
    .sort(([keyA], [keyB]) => {
      const isSameType = typeInt(keyA) === typeInt(keyB);
      const dayStrings = ["today", "yesterday", "thisWeek", "thisMonth"];

      if (isSameType) {
        const type = ["year", "month", "day"][typeInt(keyA + 1)];

        // If both are years, compare numerically
        if (type === "year") {
          return Number(keyA) - Number(keyB);
        }

        // If both are months, compare by index of month
        if (type === "month") {
          return (
            months.indexOf(keyB.toLowerCase()) -
            months.indexOf(keyA.toLowerCase())
          );
        }

        if (type === "day") {
          return dayStrings.indexOf(keyA) - dayStrings.indexOf(keyB);
        }
      }

      return typeInt(keyA) - typeInt(keyB);
    })
    .reverse();
}

// Notes
//  - there's no ability to actually create a new chat. Clicking the button will simply take them to the 'empty' chat page where their initial message will create a new chat as a side effect.

type ConversationsLayoutProps = {
  routeComponentProps: RouteComponentProps;
};
export default function Home({
  routeComponentProps,
}: ConversationsLayoutProps) {
  // Hooks
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Dashboard State
  const [currentConvoId, setCurrentConvoId] = useState<number | null>(null);
  const [convos, setConvos] = useState<Array<Conversation>>([]); // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
  const [loading, setLoading] = useState(false); // Loading state

  const refetchConversations = useCallback(async () => {
    const { data: _conversations } = await instance.get<Array<Conversation>>(
      "/plugin-atlas-ai/convos"
    );

    if (_conversations.length > 0) {
      setConvos(_conversations);
    } else {
      console.warn(`[Iliad] No conversations found`);
    }

    // If the current conversation is not in the list of conversations, navigate to the root page.
    if (
      currentConvoId &&
      !_conversations.some((convo) => convo.id === currentConvoId)
    ) {
      history.push(`${routeComponentProps.match.path}`);
      setCurrentConvoId(null);
    }

    return;
  }, []);

  const deleteConversation = useCallback(
    async (id: number): Promise<StandardResponse<null>> => {
      await instance.delete(`/plugin-atlas-ai/convo/${id}`);

      // Update optimistically on the client-side
      setConvos((prevConvos) => {
        const updatedConvos = prevConvos.filter((convo) => convo.id !== id);

        if (updatedConvos.length === 0) {
          history.push(`${routeComponentProps.match.path}`);
        } else {
          let components = history.location.pathname?.split("/");

          if (
            components?.[components?.length - 1]?.split("-")?.[0] ===
            id.toString()
          ) {
            history.push(`${routeComponentProps.match.path}`);
          }
        }

        return updatedConvos;
      });

      // Refetch conversations to update the UI
      refetchConversations();

      return {
        error: null,
        data: null,
      };
    },
    []
  );

  useEffect(() => {
    if (convos.length === 0) {
      refetchConversations();
    }
  }, [setConvos]);

  useEffect(() => {
    console.log({ convos, formattedConvos });
  }, [convos]);

  useEffect(() => {
    let currentConvoId = utils.getIdFromPathname(history.location.pathname);
    if (currentConvoId === -1) {
      return;
    }
    setCurrentConvoId(currentConvoId);
  }, [history]);

  // Derived State
  const formattedConvos = formatConvos(convos);

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
      <SubNav title={"Atlas AI"} aria-label="Conversations sub nav">
        {/* <SubNavHeader label="Conversations" /> */}
        <SubNavSections>
          <SubNavSection
            className="subNavSection header"
            id="llm-subnav-header"
          >
            {[
              {
                name: "New Conversation",
                id: "new-conversation",
                icon: <PlusCircle />,
                to: "/",
              },
              {
                to: "/plugins/plugin-atlas-docs",
                name: "About Atlas",
                id: "atlas-docs",
                icon: <Paragraph />,
                escape: true,
              },
              {
                to: "/content-manager/singleType/api::static-llm-snippet.static-llm-snippet",
                name: "Manage Snippets",
                id: "llm-snippets",
                escape: true,
                icon: <Cog />,
              },
            ].map(({ to, name, icon, escape, id }, idx) => {
              const root = escape ? "" : routeComponentProps.match.path;
              return (
                // @ts-ignore
                <Link
                  key={idx}
                  id={`btn-${id}`}
                  className="rd-link headerLink"
                  to={`${root}${to}`}
                >
                  <div className="content">
                    <div className="icon">{icon}</div>
                    <p className="convoTabText ">{name}</p>
                  </div>
                </Link>
              );
            })}
          </SubNavSection>
          {formattedConvos ? (
            <>
              {superSortConvos(formattedConvos).map(([key, convos], idx) => {
                const label = getTimeLabel(key as keyof SortedConvos);

                return (
                  <SubNavSection
                    className="subNavSection"
                    key={`sbn-${key}`}
                    label={label}
                  >
                    {convos
                      ?.sort((a: Conversation, b: Conversation) => {
                        return (
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                        );
                      })
                      .map((convo: Conversation, _idx: number) => {
                        return (
                          <ConversationLabelButton
                            data-active={(
                              currentConvoId === convo.id
                            ).toString()}
                            root={routeComponentProps.match.path}
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
            </>
          ) : (
            <div id="sideNavLoadingContainer" className="loadingContainer">
              <Loader />
            </div>
          )}
        </SubNavSections>
      </SubNav>
      <div
        style={{
          flexBasis: 0,
          flexGrow: 1,
        }}
        className="superMain"
      >
        {/* @ts-ignore */}
        <Switch>
          {/* @ts-ignore */}
          <Route
            path={`${routeComponentProps.match.path}/conversations/:id`}
            component={(props: any) => {
              return (
                // @ts-ignore
                <ConversationPage
                  refetchConversations={refetchConversations}
                  routeComponentProps={props}
                />
              );
            }}
          />
          {/* @ts-ignore */}
          <Route
            path={`${routeComponentProps.match.path}`}
            component={(props: any) => {
              // @ts-ignore
              return (
                <CreateNewPage
                  refetchConversations={refetchConversations}
                  routeComponentProps={props}
                />
              );
            }}
            // @ts-ignore
            note="this will match the new-conversation page"
            exact
          />
          {/* @ts-ignore */}
          {/* <Route
                  path={`${routeComponentProps.match.path}`}
                  component={AnErrorOccurred}
                  // @ts-ignore
                  note="this is the path that will eventually access the other ai-related pages."
                  exact
                  /> */}
          {/* @ts-ignore */}
          <Route
            // @ts-ignore
            component={(props) => {
              return (
                <div className="errorContainer" id="llm-error-occurred">
                  <AnErrorOccurred />
                </div>
              );
            }}
          />{" "}
        </Switch>
      </div>
    </Layout>
    // <div >
    // </div>
  );
}
