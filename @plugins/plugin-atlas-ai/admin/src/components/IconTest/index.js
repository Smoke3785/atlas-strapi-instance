"use strict";
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
exports.Icon = void 0;
function Icon(_a) {
    var className = _a.className, icon = _a.icon, type = _a.type, color = _a.color, props = __rest(_a, ["className", "icon", "type", "color"]);
    var _className = "icon";
    if (className) {
        _className += " ".concat(className);
    }
    return (<div className={_className} data-color-type={type} data-icon-type={type} {...props}>
      {icon}
    </div>);
}
exports.default = Icon;
exports.Icon = Icon;
