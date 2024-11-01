"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
// React
var react_1 = require("react");
// Components
var design_system_1 = require("@strapi/design-system");
var react_markdown_1 = require("react-markdown");
// Utils
var helperFunctions_1 = require("./utils/functions/helperFunctions");
var transformReactMarkdown_1 = require("./utils/functions/transformReactMarkdown");
// Styles
var styled_components_1 = require("styled-components");
// Static Chat Container styled component
var ChatContainer = (0, styled_components_1.default)(design_system_1.Box)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 0;\n  margin: 0;\n  background-color: ", ";\n  color: ", ";\n\n  .chatgpt-message {\n    margin-top: 1rem;\n    color: ", ";\n  }\n\n  .user-message {\n    color: ", ";\n  }\n\n  pre {\n    position: relative;\n  }\n"], ["\n  padding: 0;\n  margin: 0;\n  background-color: ", ";\n  color: ", ";\n\n  .chatgpt-message {\n    margin-top: 1rem;\n    color: ", ";\n  }\n\n  .user-message {\n    color: ", ";\n  }\n\n  pre {\n    position: relative;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.neutral0;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.neutral800;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.neutral600;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.neutral800;
});
var Response = function (_a) {
    var message = _a.message, userInfo = _a.userInfo;
    // Memoize the name transformation and AI check
    var messageClass = (0, react_1.useMemo)(function () {
        return helperFunctions_1.responseUtils.isFromAI(message.name) ? "chatgpt-message" : "user-message";
    }, [message.name]);
    var _name = (0, react_1.useMemo)(function () { return helperFunctions_1.responseUtils.transformName(message.name, userInfo === null || userInfo === void 0 ? void 0 : userInfo.firstname); }, [message.name, userInfo === null || userInfo === void 0 ? void 0 : userInfo.firstname]);
    return (<ChatContainer className="chatMessageContainer">
      <design_system_1.Typography variant="omega" as="p" className={"atlas-message ".concat(messageClass)}>
        <p className="messageSender">{_name}</p>
        <react_markdown_1.default components={transformReactMarkdown_1.default}>{message.message}</react_markdown_1.default>
      </design_system_1.Typography>
      {helperFunctions_1.responseUtils.isFromAI(message.name) && (<design_system_1.Box paddingTop={2} paddingBottom={4}>
          <design_system_1.Divider />
        </design_system_1.Box>)}
    </ChatContainer>);
};
exports.Response = Response;
exports.default = Response;
var templateObject_1;
