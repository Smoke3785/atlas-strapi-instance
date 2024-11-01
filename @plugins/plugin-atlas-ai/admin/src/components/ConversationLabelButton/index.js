"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationLabelButton = void 0;
var hooks_1 = require("../../utils/hooks"); // Custom hooks
var frontendUtils_1 = require("../../utils/frontendUtils"); // Frontend utils
var index_1 = require("../IconTest/index"); // Icon component
// Hooks
var react_1 = require("react");
// React Router
var react_router_dom_1 = require("react-router-dom");
// Icons
var icons_1 = require("@strapi/icons");
// Context Menu
// Main Label Button
var ConversationLabelButton = function (_a) {
    var convo = _a.convo, onDelete = _a.onDelete, root = _a.root, onClick = _a.onClick;
    var id = convo.id;
    var idHash = frontendUtils_1.utils.hash64(id.toString());
    // State
    var _b = (0, react_1.useState)(false), isContextMenuOpen = _b[0], setIsContextMenuOpen = _b[1];
    var ctxMenuRef = (0, hooks_1.useClickOutside)(function () {
        setIsContextMenuOpen(false);
    });
    var closeContextMenu = (0, react_1.useCallback)(function () {
        setIsContextMenuOpen(false);
    }, []);
    // Context Buttons
    var ctxButtons = [
        {
            name: "Delete",
            icon: <icons_1.Cross />,
            type: "danger",
            onClick: function () {
                onDelete(convo.id);
                closeContextMenu();
            },
        },
        {
            name: "Rename",
            icon: <icons_1.Pencil />,
            disabled: true,
            type: "default",
            onClick: function () { },
        },
    ];
    return (<div className="convoTabTextContainer rd-link-container">
      {/* @ts-ignore */}
      <react_router_dom_1.Link className="rd-link" to={"".concat(root, "/conversations/").concat(id, "-").concat(idHash)}>
        <p className="convoTabText gradient-overflow-text">
          {convo.name.replaceAll("\"", "")}
        </p>
      </react_router_dom_1.Link>
      <div data-pointer-none={isContextMenuOpen.toString()} className="contextButtonContainer">
        <icons_1.More onClick={function () { return setIsContextMenuOpen(true); }} className="ctxLabel"/>
      </div>
      {isContextMenuOpen && (<div ref={ctxMenuRef} className="contextMenu">
          {ctxButtons.map(function (_a, idx) {
                var name = _a.name, icon = _a.icon, type = _a.type, onClick = _a.onClick, disabled = _a.disabled;
                return (<div className="rd-link contextMenuItem" data-disabled={!!disabled} onClick={onClick} key={idx}>
                <p className="ctxMenuText">{name}</p>
                <index_1.default type={type} icon={icon}/>
              </div>);
            })}
        </div>)}
    </div>);
};
exports.ConversationLabelButton = ConversationLabelButton;
exports.default = ConversationLabelButton;
