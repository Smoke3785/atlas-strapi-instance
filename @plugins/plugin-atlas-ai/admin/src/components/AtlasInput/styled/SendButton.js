"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendButton = void 0;
var design_system_1 = require("@strapi/design-system");
var styled_components_1 = require("styled-components");
var sendButtonAttributes = {
    className: "sendButton",
};
var SendButton = (0, styled_components_1.default)(design_system_1.Button).attrs(sendButtonAttributes)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-radius: 99rem;\n"], ["\n  border-radius: 99rem;\n"])));
exports.SendButton = SendButton;
exports.default = SendButton;
var templateObject_1;
