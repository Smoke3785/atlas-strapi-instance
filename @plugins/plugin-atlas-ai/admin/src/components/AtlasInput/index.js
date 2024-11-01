"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasInput = void 0;
// React
var design_system_1 = require("@strapi/design-system");
var react_1 = require("react");
var styled_1 = require("./styled");
var validate_1 = require("./utils/validate");
// Icons
var icons_1 = require("@strapi/icons");
function AtlasInput(_a) {
    var _this = this;
    var onSubmit = _a.onSubmit;
    var _b = (0, react_1.useState)(""), inputState = _b[0], setInputState = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(""), error = _d[0], setError = _d[1];
    var updateError = (0, react_1.useCallback)(function (error) {
        console.error("[AtlasInput] Error: ".concat(error));
        setError(error.toString());
    }, []);
    var handleSubmission = (0, react_1.useCallback)(function (e) { return __awaiter(_this, void 0, void 0, function () {
        var prompt, validationError, submitError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    prompt = "".concat(inputState.trim());
                    setLoading(true);
                    validationError = (0, validate_1.validatePrompt)(prompt);
                    if (validationError) {
                        updateError(validationError);
                        return [3 /*break*/, 2];
                    }
                    // Clear input state
                    setInputState("");
                    return [4 /*yield*/, onSubmit(prompt)];
                case 1:
                    submitError = _a.sent();
                    if (submitError) {
                        updateError(submitError);
                        return [3 /*break*/, 2];
                    }
                    _a.label = 2;
                case 2:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [inputState]);
    return (<styled_1.AtlasInputRoot>
      <form onSubmit={handleSubmission}>
        <styled_1.AtlasGrid gap={2} paddingTop={4}>
          <design_system_1.GridItem col={11}>
            <design_system_1.TextInput placeholder={"Message Atlas AI"} aria-label="Content" value={inputState} disabled={loading} id="chatInput" name="prompt" error={error} onChange={function (e) {
            e.preventDefault();
            setInputState(e.target.value);
            setError("");
        }}/>
          </design_system_1.GridItem>
          <design_system_1.GridItem>
            <styled_1.SendButton startIcon={<icons_1.PaperPlane />} disabled={loading} loading={loading} type="submit">
              Send
            </styled_1.SendButton>
          </design_system_1.GridItem>
        </styled_1.AtlasGrid>
      </form>
    </styled_1.AtlasInputRoot>);
}
exports.default = AtlasInput;
exports.AtlasInput = AtlasInput;
