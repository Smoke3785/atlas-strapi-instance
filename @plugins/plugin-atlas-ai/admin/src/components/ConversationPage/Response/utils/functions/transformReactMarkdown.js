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
var design_system_1 = require("@strapi/design-system");
var react_1 = require("react");
var prism_1 = require("react-syntax-highlighter/dist/esm/styles/prism");
var react_syntax_highlighter_1 = require("react-syntax-highlighter");
var styled_components_1 = require("styled-components");
// Static Copy Button styled component
var CopyButton = (0, styled_components_1.default)(design_system_1.Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  right: 10px;\n  top: 10px;\n"], ["\n  position: absolute;\n  right: 10px;\n  top: 10px;\n"])));
var CodeBlock = function (_a) {
    var language = _a.language, value = _a.value;
    var copyToClipboard = (0, react_1.useCallback)(function () {
        navigator.clipboard.writeText(value).then(function () {
            alert("Code copied to clipboard!");
        });
    }, [value]);
    return (<design_system_1.Box position="relative">
      <react_syntax_highlighter_1.Prism language={language} style={prism_1.oneDark}>
        {value}
      </react_syntax_highlighter_1.Prism>
      <CopyButton variant="tertiary" onClick={copyToClipboard}>
        Copy Code
      </CopyButton>
    </design_system_1.Box>);
};
var components = {
    code: function (_a) {
        var node = _a.node, inline = _a.inline, className = _a.className, children = _a.children, props = __rest(_a, ["node", "inline", "className", "children"]);
        var match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (<CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")}/>) : (<code className={className} {...props}>
        {children}
      </code>);
    },
};
exports.default = components;
var templateObject_1;
