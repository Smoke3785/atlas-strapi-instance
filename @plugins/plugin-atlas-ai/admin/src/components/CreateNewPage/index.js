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
exports.ConvoTabText = exports.formatConvos = exports.getTimeLabel = void 0;
// Hooks / Functions
var react_1 = require("react");
var react_intl_1 = require("react-intl");
// Utils
var frontendUtils_1 = require("../../utils/frontendUtils");
var react_router_dom_1 = require("react-router-dom");
var AtlasInput_1 = require("../AtlasInput");
var months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];
// Helper Functions
function getTimeLabel(key) {
    var labels = {
        today: "Today",
        yesterday: "Yesterday",
        thisWeek: "Past 7 Days",
        thisMonth: "Past 30 Days",
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
    };
    return (labels === null || labels === void 0 ? void 0 : labels[key]) || key;
}
exports.getTimeLabel = getTimeLabel;
function formatConvos(convos) {
    var sortedConvos = {};
    // Helper functions for date calculations
    var startOfDay = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    var startOfWeek = function (date) {
        var dayOfWeek = date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek);
    };
    var today = startOfDay(new Date());
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var thisWeekStart = startOfWeek(today);
    var thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    // Categorize conversations into the relevant buckets
    convos.forEach(function (convo) {
        var convoDate = new Date(convo.updatedAt);
        var startOfConvoDay = startOfDay(convoDate);
        // Categorize by "today", "yesterday", "this week", and "this month" in priority order
        if (startOfConvoDay.getTime() === today.getTime()) {
            if (!sortedConvos.today)
                sortedConvos.today = [];
            sortedConvos.today.push(convo);
            return;
        }
        if (startOfConvoDay.getTime() === yesterday.getTime()) {
            if (!sortedConvos.yesterday)
                sortedConvos.yesterday = [];
            sortedConvos.yesterday.push(convo);
            return;
        }
        if (startOfConvoDay >= thisWeekStart) {
            if (!sortedConvos.thisWeek)
                sortedConvos.thisWeek = [];
            sortedConvos.thisWeek.push(convo);
            return;
        }
        if (convoDate >= thisMonthStart) {
            if (!sortedConvos.thisMonth)
                sortedConvos.thisMonth = [];
            sortedConvos.thisMonth.push(convo);
            return;
        }
        // Sort by year (if it doesn't fit into today, yesterday, this week, or this month)
        var year = convoDate.getFullYear();
        if (!sortedConvos[year]) {
            sortedConvos[year] = [];
        }
        sortedConvos[year].push(convo);
        // Sort by month
        var month = convoDate.toLocaleString("en-US", {
            month: "long",
        });
        if (!sortedConvos[month]) {
            sortedConvos[month] = [];
        }
        sortedConvos[month].push(convo);
    });
    return sortedConvos;
}
exports.formatConvos = formatConvos;
function typeInt(value) {
    function isMonth(value) {
        return months.includes(value.toLowerCase());
    }
    function isYear(value) {
        return !isNaN(Number(value));
    }
    // console.log(`[Iliad] typeInt: ${value} is being checked...`);
    if (isYear(value)) {
        return -1;
    }
    // console.log(`[Iliad] typeInt: ${value} is not a year`);
    if (isMonth(value)) {
        return 0;
    }
    // console.log(`[Iliad] typeInt: ${value} is not a month`);
    // console.log(`[Iliad] typeInt: ${value} must be a day string`);
    return 1;
}
// Staging Components
var ConvoTabText = function (_a) {
    var convo = _a.convo, onDelete = _a.onDelete, onClick = _a.onClick;
    return (<div onClick={function () {
            onClick(convo.id);
        }} className="convoTabTextContainer">
      <p className="convoTabText">{convo.name}</p>
      <div className="contextButtonContainer">
        <p onClick={function () {
            onDelete(convo.id);
        }} className="ctxLabel">
          X
        </p>
      </div>
    </div>);
};
exports.ConvoTabText = ConvoTabText;
function CreateNewPage(_a) {
    var _this = this;
    var routeComponentProps = _a.routeComponentProps, refetchConversations = _a.refetchConversations;
    // Hooks
    var formatMessage = (0, react_intl_1.useIntl)().formatMessage;
    var history = (0, react_router_dom_1.useHistory)();
    // Dashboard State
    var _b = (0, react_1.useState)([]), convos = _b[0], setConvos = _b[1]; // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1]; // Loading state
    var _d = (0, react_1.useState)(""), prompt = _d[0], setPrompt = _d[1]; // The user's input
    var _e = (0, react_1.useState)(""), error = _e[0], setError = _e[1]; // Error message, if any
    // Handles the change of the prompt input
    var handlePromptChange = (0, react_1.useCallback)(function (e) {
        setPrompt(e.target.value);
        setError("");
    }, []);
    // Declaratively-titled function
    var clearError = (0, react_1.useCallback)(function () {
        setError("");
    }, []);
    var reportError = (0, react_1.useCallback)(function (intlId) {
        // This is a little sketchy, may refactor
        var fMsg = formatMessage({ id: intlId, defaultMessage: intlId });
        console.warn("[Iliad] Error: ".concat(intlId));
        setError(fMsg);
        return new Error(fMsg);
    }, []);
    var handlePromptSubmission = (0, react_1.useCallback)(function (prompt) { return __awaiter(_this, void 0, void 0, function () {
        var finalOutput, responseMessage, promptMessage, _a, promptResponse, error_1, updatedConversation, _b, newConvo, _error, ncPath, rootPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("[Iliad] Prompt: ".concat(prompt));
                    finalOutput = "Function body not executed";
                    setLoading(true);
                    return [4 /*yield*/, frontendUtils_1.atlas.submitPrompt({
                            prompt: prompt,
                        })];
                case 1:
                    _a = _c.sent(), promptResponse = _a.data, error_1 = _a.error;
                    console.log("[Iliad] Prompt submitted", {
                        promptResponse: promptResponse,
                        error: error_1,
                    });
                    if (error_1) {
                        finalOutput = error_1.message;
                        return [3 /*break*/, 3];
                    }
                    // Turn our data into a message
                    responseMessage = promptResponse;
                    promptMessage = {
                        message: prompt,
                        name: "you",
                    };
                    updatedConversation = void 0;
                    return [4 /*yield*/, frontendUtils_1.atlas.createConversation({
                            content: [promptMessage, responseMessage],
                        })];
                case 2:
                    _b = _c.sent(), newConvo = _b.data, _error = _b.error;
                    if (_error) {
                        finalOutput = _error.message;
                        return [3 /*break*/, 3];
                    }
                    // Update the conversation state with the new conversation
                    refetchConversations();
                    ncPath = "".concat(newConvo.id, "-").concat(frontendUtils_1.utils.hash64("".concat(newConvo.id)));
                    rootPath = routeComponentProps.match.path;
                    // Now redirect to the conversation page
                    history.push("".concat(rootPath, "/conversations/").concat(ncPath));
                    _c.label = 3;
                case 3:
                    setLoading(false);
                    return [2 /*return*/, null]; // No error
            }
        });
    }); }, [prompt]);
    return (<div style={{
            flexBasis: 0,
            flexGrow: 1,
        }} className="superMain create">
      <div>
        <div className="stickyInputContainer">
          <h1 className="createSplashText">What can I help with?</h1>
          <AtlasInput_1.default onSubmit={handlePromptSubmission}/>
        </div>
      </div>
    </div>);
}
exports.default = CreateNewPage;
