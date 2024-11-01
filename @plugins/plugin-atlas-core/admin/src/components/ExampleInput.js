"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Input = React.forwardRef(function (_a, ref) {
    var _b = _a.onChange, onChange = _b === void 0 ? function () { } : _b, // Default to a no-op function
    _c = _a.disabled, // Default to a no-op function
    disabled = _c === void 0 ? false : _c, _d = _a.required, required = _d === void 0 ? false : _d, _e = _a.value, value = _e === void 0 ? "" : _e, attribute = _a.attribute, intlLabel = _a.intlLabel, name = _a.name;
    var handleChange = function (e) {
        onChange({
            target: { name: name, type: attribute.type, value: e.currentTarget.value },
        });
    };
    return (<label>
        {/* {formatMessage(intlLabel)} */}
        Fart!
        <input ref={ref} name={name} value={value} required={required} disabled={disabled} onChange={handleChange}/>
      </label>);
});
exports.default = Input;
