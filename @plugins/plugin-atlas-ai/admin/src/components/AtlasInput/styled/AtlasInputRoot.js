"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasInputRoot = void 0;
var styled_components_1 = require("styled-components");
var design_system_1 = require("@strapi/design-system");
var atlasInputAttributes = {
    className: "atlasInputRoot",
};
var AtlasInputRoot = (0, styled_components_1.default)(design_system_1.Box).attrs(atlasInputAttributes)(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
exports.AtlasInputRoot = AtlasInputRoot;
exports.default = AtlasInputRoot;
var templateObject_1;
