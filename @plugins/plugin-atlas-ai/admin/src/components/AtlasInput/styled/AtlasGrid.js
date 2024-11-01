"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.AtlasGrid = void 0;
var styled_components_1 = require("styled-components");
var design_system_1 = require("@strapi/design-system");
var atlasGridAttributes = {};
var AtlasGrid = (0, styled_components_1.default)(design_system_1.Grid).attrs(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return __assign(__assign({ className: "".concat(className, " atlasInputGrid") }, atlasGridAttributes), props);
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 0;\n"], ["\n  padding-top: 0;\n"])));
exports.AtlasGrid = AtlasGrid;
exports.default = AtlasGrid;
var templateObject_1;
