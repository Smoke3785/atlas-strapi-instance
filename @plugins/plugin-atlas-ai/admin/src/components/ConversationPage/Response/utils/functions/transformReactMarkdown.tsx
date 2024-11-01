import { Box, Divider, Typography, Button } from "@strapi/design-system";
import { useCallback } from "react";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styled from "styled-components";

// Static Copy Button styled component
const CopyButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

type CodeBlockProps = {
  language: string;
  value: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      alert("Code copied to clipboard!");
    });
  }, [value]);

  return (
    <Box position="relative">
      <SyntaxHighlighter language={language} style={oneDark}>
        {value}
      </SyntaxHighlighter>
      <CopyButton variant="tertiary" onClick={copyToClipboard}>
        Copy Code
      </CopyButton>
    </Box>
  );
};

type RMComponents = {
  [key: string]: React.FC<any>;
};

const components: RMComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <CodeBlock
        language={match[1]}
        value={String(children).replace(/\n$/, "")}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export default components;
