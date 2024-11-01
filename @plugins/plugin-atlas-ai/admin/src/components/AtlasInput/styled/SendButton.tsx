import { Button } from "@strapi/design-system";
import styled from "styled-components";

const sendButtonAttributes = {
  className: "sendButton",
};

const SendButton = styled(Button).attrs(sendButtonAttributes)`
  border-radius: 99rem;
`;

export default SendButton;
export { SendButton };
