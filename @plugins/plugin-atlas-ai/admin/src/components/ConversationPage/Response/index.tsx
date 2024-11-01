// React
import React, { useMemo } from "react";

// Components
import { Box, Divider, Typography } from "@strapi/design-system";
import ReactMarkdown from "react-markdown";

// Utils
import { responseUtils } from "./utils/functions/helperFunctions";
import components from "./utils/functions/transformReactMarkdown";

// Styles
import styled from "styled-components";

// Types
import type { Message, UserInfo } from "../../../../../@types/atlas";

type ResponseProps = {
  userInfo: UserInfo;
  message: Message;
};

// Static Chat Container styled component
const ChatContainer = styled(Box)`
  padding: 0;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};

  .chatgpt-message {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.neutral600};
  }

  .user-message {
    color: ${({ theme }) => theme.colors.neutral800};
  }

  pre {
    position: relative;
  }
`;

const Response: React.FC<ResponseProps> = ({ message, userInfo }) => {
  // Memoize the name transformation and AI check
  const messageClass = useMemo(
    () =>
      responseUtils.isFromAI(message.name) ? "chatgpt-message" : "user-message",
    [message.name]
  );

  const _name = useMemo(
    () => responseUtils.transformName(message.name, userInfo?.firstname),
    [message.name, userInfo?.firstname]
  );

  return (
    <ChatContainer className="chatMessageContainer">
      <Typography
        variant="omega"
        as="p"
        className={`atlas-message ${messageClass}`}
      >
        <p className="messageSender">{_name}</p>
        <ReactMarkdown components={components}>{message.message}</ReactMarkdown>
      </Typography>
      {responseUtils.isFromAI(message.name) && (
        <Box paddingTop={2} paddingBottom={4}>
          <Divider />
        </Box>
      )}
    </ChatContainer>
  );
};

export default Response;
export { Response };
