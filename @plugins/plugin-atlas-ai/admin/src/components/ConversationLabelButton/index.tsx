import type { Conversation } from "../../../../@types/atlas"; // Project types
import { useClickOutside } from "../../utils/hooks"; // Custom hooks
import { utils } from "../../utils/frontendUtils"; // Frontend utils
import type { IconType } from "../IconTest/index";
import Icon from "../IconTest/index"; // Icon component

// Hooks
import { useCallback, useState } from "react";

// React Router
import { Link } from "react-router-dom";

// Icons
import { Pencil, More, Cross } from "@strapi/icons";

type ConvoTabProps = {
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  convo: Conversation;
  root: string;
};

type CtxBtn = {
  name: string;
  type: IconType;
  icon: JSX.Element;
  disabled?: boolean;
  onClick: () => void;
};

type CtxBtns = Array<CtxBtn>;

// Context Menu

// Main Label Button
const ConversationLabelButton = ({
  convo,
  onDelete,
  root,
  onClick,
}: ConvoTabProps) => {
  const { id } = convo;
  const idHash = utils.hash64(id.toString());

  // State
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const ctxMenuRef = useClickOutside<HTMLDivElement>(() => {
    setIsContextMenuOpen(false);
  });

  const closeContextMenu = useCallback(() => {
    setIsContextMenuOpen(false);
  }, []);

  // Context Buttons
  const ctxButtons: CtxBtns = [
    {
      name: "Delete",
      icon: <Cross />,
      type: "danger",
      onClick: () => {
        onDelete(convo.id);
        closeContextMenu();
      },
    },
    {
      name: "Rename",
      icon: <Pencil />,
      disabled: true,
      type: "default",
      onClick: () => {},
    },
  ];

  return (
    <div className="convoTabTextContainer rd-link-container">
      {/* @ts-ignore */}
      <Link className="rd-link" to={`${root}/conversations/${id}-${idHash}`}>
        <p className="convoTabText gradient-overflow-text">
          {convo.name.replaceAll(`"`, "")}
        </p>
      </Link>
      <div
        data-pointer-none={isContextMenuOpen.toString()}
        className="contextButtonContainer"
      >
        <More onClick={() => setIsContextMenuOpen(true)} className="ctxLabel" />
      </div>
      {isContextMenuOpen && (
        <div ref={ctxMenuRef} className="contextMenu">
          {ctxButtons.map(({ name, icon, type, onClick, disabled }, idx) => {
            return (
              <div
                className="rd-link contextMenuItem"
                data-disabled={!!disabled}
                onClick={onClick}
                key={idx}
              >
                <p className="ctxMenuText">{name}</p>
                <Icon type={type} icon={icon} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationLabelButton;
export { ConversationLabelButton };
