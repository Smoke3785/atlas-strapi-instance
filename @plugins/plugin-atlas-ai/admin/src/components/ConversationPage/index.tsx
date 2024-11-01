import { auth as _auth } from "@strapi/helper-plugin";
// Types
import type {
  Message,
  UserInfo,
  Conversation,
  StandardResponse,
  CurrentConversation,
} from "../../../../@types/atlas";
import type { RouteComponentProps } from "react-router-dom";

// Icons
import { PaperPlane, Command, Cog, Picture, PlusCircle } from "@strapi/icons";

// UI Components
import Response from "./Response";
import AtlasInput from "../AtlasInput";
import {
  Box,
  Main,
  Grid,
  Loader,
  Button,
  GridItem,
  TextInput,
  ContentLayout,
} from "@strapi/design-system";

// Hooks
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

// Functions / Utils
import { utils, atlas, instance } from "../../utils/frontendUtils";

// Local Types
type ConversationPageProps = {
  routeComponentProps: RouteComponentProps;
  refetchConversations: () => void;
};

const ConversationPage = ({
  routeComponentProps,
  refetchConversations,
}: ConversationPageProps) => {
  // Initial data
  const id = utils.getIdFromRoute(routeComponentProps);
  const userInfo: UserInfo = _auth.getUserInfo() as UserInfo;

  // Refs
  const scrollContainer = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch conversation
  const fetchConversation = useCallback(async (id: number) => {
    const { data, error } = await atlas.getConversation(id);
    if (error) {
      console.error(`[Iliad] fetchConversation error: ${error}`);
      return;
    }
    setConversation(data);
  }, []);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  useEffect(() => {
    fetchConversation(id).then(() => {
      setInitialLoading(false);
    });
  }, [fetchConversation]);

  // Submit prompt handler
  const handlePromptSubmission = useCallback(
    async (prompt: string): Promise<string | null> => {
      // clear error before submitting
      if (!conversation) {
        return "Current conversation not found or loaded";
      }

      const promptMessage = {
        message: prompt,
        name: "you",
      };

      setLoading(true);

      const { data: promptResponse, error } = await atlas.submitPrompt({
        cid: conversation.id,
        prompt,
      });

      if (error) {
        setLoading(false);
        return error.message;
      }

      // Update conversation state with new messages
      setConversation((prev: any) => ({
        ...prev,
        content: [...prev.content, promptMessage, promptResponse],
      }));

      setLoading(false);

      return null; // no error
    },
    [conversation]
  );

  // Memoized content for better performance
  const renderedMessages = useMemo(
    () =>
      conversation?.content.map((response: any, index: number) => (
        <Response key={index} userInfo={userInfo} message={response} />
      )),
    [conversation?.content, userInfo]
  );

  return (
    <div className="conversationPageMainContainer">
      <Main ref={scrollContainer}>
        <ContentLayout>
          <header className="atlasHeader">
            <h1 className="atlasAiText">Atlas_4o-mini</h1>
          </header>
          <main className="contentContainer">
            {initialLoading ? (
              <div className="loadingContainer llm-initial-loader">
                <Loader />
              </div>
            ) : (
              <div className="chatItemsContainer">
                {renderedMessages}
                {loading && (
                  <div className="loadingContainer llm-response-loader">
                    <Loader />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>
        </ContentLayout>
      </Main>
      <div className="stickyInputContainer conversationPage">
        <AtlasInput onSubmit={handlePromptSubmission} />
      </div>
    </div>
  );
};

export default ConversationPage;
