"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var react_1 = require("react");
var design_system_1 = require("@strapi/design-system");
var styled_components_1 = require("styled-components");
var react_markdown_1 = require("react-markdown");
var react_syntax_highlighter_1 = require("react-syntax-highlighter");
var prism_1 = require("react-syntax-highlighter/dist/esm/styles/prism");
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
var CopyButton = (0, styled_components_1.default)(design_system_1.Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  right: 10px;\n  top: 10px;\n"], ["\n  position: absolute;\n  right: 10px;\n  top: 10px;\n"])));
var CodeBlock = function (_a) {
    var language = _a.language, value = _a.value;
    var copyToClipboard = function () {
        navigator.clipboard.writeText(value).then(function () {
            alert("Code copied to clipboard!");
        });
    };
    return (<design_system_1.Box position="relative">
      <react_syntax_highlighter_1.Prism language={language} style={prism_1.oneDark}>
        {value}
      </react_syntax_highlighter_1.Prism>
      <CopyButton variant="tertiary" onClick={copyToClipboard}>
        Copy Code
      </CopyButton>
    </design_system_1.Box>);
};
var Response = function (_a) {
    var children = _a.children;
    var components = {
        code: function (_a) {
            var node = _a.node, inline = _a.inline, className = _a.className, children = _a.children, props = __rest(_a, ["node", "inline", "className", "children"]);
            var match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (<CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")}/>) : (<code className={className} {...props}>
          {children}
        </code>);
        },
    };
    function isFromAI(name) {
        return ["Atlas AI", "chatgpt"].includes(name);
    }
    var messageClass = isFromAI(children.name)
        ? "chatgpt-message"
        : "user-message";
    return (<ChatContainer className="chatMessageContainer">
      <design_system_1.Typography variant="omega" as="p" className={messageClass}>
        {children.name}:{/* @ts-ignore */}
        <react_markdown_1.default components={components}>
          {children.message}
        </react_markdown_1.default>
      </design_system_1.Typography>
      {isFromAI(children.name) && (<design_system_1.Box paddingTop={2} paddingBottom={4}>
          <design_system_1.Divider />
        </design_system_1.Box>)}
    </ChatContainer>);
};
exports.Response = Response;
exports.default = Response;
var templateObject_1, templateObject_2;
