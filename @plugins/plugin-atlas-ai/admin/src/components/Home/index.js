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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvoTabText = exports.formatConvos = exports.getTimeLabel = void 0;
// Hooks / Functions
var react_1 = require("react");
var react_intl_1 = require("react-intl");
// Utils
var frontendUtils_1 = require("../../utils/frontendUtils");
// Icons
var icons_1 = require("@strapi/icons");
// UI Library Components
var design_system_1 = require("@strapi/design-system");
// UI Components
var response_1 = require("./response");
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
// Notes
//  - there's no ability to actually create a new chat. Clicking the button will simply take them to the 'empty' chat page where their initial message will create a new chat as a side effect.
function Home() {
    var _this = this;
    // Hooks
    var formatMessage = (0, react_intl_1.useIntl)().formatMessage;
    // Dashboard State
    var _a = (0, react_1.useState)(null), currentConvoId = _a[0], setCurrentConvoId = _a[1];
    var _b = (0, react_1.useState)([]), convos = _b[0], setConvos = _b[1]; // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
    var _c = (0, react_1.useState)("you"), user_name = _c[0], setUserName = _c[1]; // future proofing here
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1]; // Loading state
    var _e = (0, react_1.useState)(""), prompt = _e[0], setPrompt = _e[1]; // The user's input
    var _f = (0, react_1.useState)(""), error = _f[0], setError = _f[1]; // Error message, if any
    // Refs
    var messagesEndRef = (0, react_1.useRef)(null);
    // Event Handlers
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
    var handleCreateTab = function () { return __awaiter(_this, void 0, void 0, function () {
        var defaultConvoName, newConvo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultConvoName = formatMessage({
                        id: "strapi-supergpt.homePage.convo.new.name",
                    });
                    return [4 /*yield*/, frontendUtils_1.instance.post("/plugin-atlas-ai/convo", {
                            name: "".concat(defaultConvoName, " ").concat(convos.length + 1),
                        })];
                case 1:
                    newConvo = (_a.sent()).data;
                    setConvos(function (prevConvos) { return __spreadArray(__spreadArray([], prevConvos, true), [newConvo], false); });
                    setCurrentConvoId(newConvo.id);
                    return [2 /*return*/];
            }
        });
    }); };
    var getCurrentConversation = (0, react_1.useCallback)(function () {
        var matching = convos.find(function (convo) { return convo.id === currentConvoId; });
        if (!matching) {
            return;
        }
        return matching;
    }, [convos, currentConvoId]);
    // This is where the error is occurring
    var updateConversationState = (0, react_1.useCallback)(function (updatedConversation) {
        setConvos(function (prevConvos) {
            var _prevConvos = __spreadArray([], prevConvos, true);
            // If no conversations exist, we can't update anything.
            // Just return the updated conversation as the only conversation.
            if (prevConvos.length === 0) {
                return [updatedConversation];
            }
            if (!updatedConversation.id) {
                console.warn("[Iliad] updateConversationState: updatedConversation has no id", { updatedConversation: updatedConversation });
                return _prevConvos;
            }
            // Otherwise, find the index of the conversation to update
            var index = prevConvos.findIndex(function (convo) { return (convo === null || convo === void 0 ? void 0 : convo.id) === updatedConversation.id; });
            // If it doesn't exist, add it to the list of conversations
            if (index === -1) {
                return __spreadArray(__spreadArray([], prevConvos, true), [updatedConversation], false);
            }
            // Otherwise, update the conversation in place
            _prevConvos[index] = updatedConversation;
            // Return the updated list of conversations
            return _prevConvos;
        });
    }, [getCurrentConversation, currentConvoId, user_name, setConvos, convos]);
    var handlePromptSubmission = (0, react_1.useCallback)(function (e, type) {
        if (type === void 0) { type = "text"; }
        return __awaiter(_this, void 0, void 0, function () {
            var finalOutput, currentConversation, responseMessage, promptMessage, _a, promptResponse, error_1, updatedConversation_1, _b, updatedConvo, error_2, _c, newConvo, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        e.preventDefault(); // We don't need this event to propagate
                        clearError(); // Clear any existing errors - this is a new submission
                        console.log("[Iliad] Prompt: ".concat(prompt));
                        finalOutput = {
                            error: new Error("Function body not executed"),
                            data: null,
                        };
                        currentConversation = getCurrentConversation();
                        setLoading(true);
                        console.log("[Iliad] About to enter function body", {
                            currentConversation: currentConversation,
                            currentConvoId: currentConvoId,
                            user_name: user_name,
                            prompt: prompt,
                        });
                        // If the prompt state is empty, we can't proceed
                        if (!prompt) {
                            finalOutput = {
                                error: reportError("strapi-supergpt.homePage.error.promptRequired"),
                                data: null,
                            };
                            return [3 /*break*/, 6];
                        }
                        return [4 /*yield*/, frontendUtils_1.atlas.submitPrompt({
                                cid: frontendUtils_1.utils.nullToUndefined(currentConvoId),
                                prompt: prompt,
                            })];
                    case 1:
                        _a = _d.sent(), promptResponse = _a.data, error_1 = _a.error;
                        console.log("[Iliad] Prompt submitted", {
                            promptResponse: promptResponse,
                            error: error_1,
                        });
                        if (error_1) {
                            finalOutput = {
                                error: reportError(error_1.message),
                                data: null,
                            };
                            return [3 /*break*/, 6];
                        }
                        // Turn our data into a message
                        responseMessage = promptResponse;
                        promptMessage = {
                            message: prompt,
                            name: user_name,
                        };
                        console.log("[Iliad] messages assembled", {
                            promptResponse: promptResponse,
                            error: error_1,
                        });
                        if (!(currentConversation && currentConvoId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, frontendUtils_1.atlas.updateConversation(currentConvoId, {
                                // NOTE: This part is suspect, because it assumes the client has the full conversation in memory.
                                content: [promptMessage, responseMessage],
                            })];
                    case 2:
                        _b = _d.sent(), updatedConvo = _b.data, error_2 = _b.error;
                        if (error_2) {
                            finalOutput = {
                                error: reportError(error_2.message),
                                data: null,
                            };
                            return [3 /*break*/, 6];
                        }
                        updatedConversation_1 = updatedConvo;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, frontendUtils_1.atlas.createConversation({
                            content: [promptMessage, responseMessage],
                        })];
                    case 4:
                        _c = _d.sent(), newConvo = _c.data, error_3 = _c.error;
                        if (error_3) {
                            finalOutput = {
                                error: reportError(error_3.message),
                                data: null,
                            };
                            return [3 /*break*/, 6];
                        }
                        updatedConversation_1 = newConvo;
                        // If we created a new conversation, we need to add it to the list of conversations
                        setConvos(function (prevConvos) { return __spreadArray(__spreadArray([], prevConvos, true), [updatedConversation_1], false); });
                        _d.label = 5;
                    case 5:
                        console.log("[Iliad] Conversation updated", {
                            updatedConversation: updatedConversation_1,
                        });
                        // Now we have responded to the user's prompt and created a new conversation if necessary.
                        // Let's update the state with the new conversation.
                        updateConversationState(updatedConversation_1);
                        setCurrentConvoId(updatedConversation_1.id);
                        _d.label = 6;
                    case 6:
                        setLoading(false);
                        return [2 /*return*/, finalOutput];
                }
            });
        });
    }, [prompt, currentConvoId, user_name, getCurrentConversation]);
    var deleteConversation = (0, react_1.useCallback)(function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, frontendUtils_1.instance.delete("/plugin-atlas-ai/convo/".concat(id))];
                case 1:
                    _a.sent();
                    setConvos(function (prevConvos) {
                        var updatedConvos = prevConvos.filter(function (convo) { return convo.id !== id; });
                        return updatedConvos;
                    });
                    return [2 /*return*/, {
                            error: null,
                            data: null,
                        }];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);
    var refetchConversations = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _conversations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, frontendUtils_1.instance.get("/plugin-atlas-ai/convos")];
                case 1:
                    _conversations = (_a.sent()).data;
                    if (_conversations.length > 0) {
                        setConvos(_conversations);
                    }
                    else {
                        console.warn("[Iliad] No conversations found");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        if (convos.length === 0) {
            refetchConversations();
        }
    }, [setConvos]);
    (0, react_1.useEffect)(function () {
        console.log({ convos: convos, formattedConvos: formattedConvos });
    }, [convos]);
    // Derived State
    var formattedConvos = formatConvos(convos);
    var currentConversation = getCurrentConversation();
    return (<design_system_1.Layout data-component="ism-layout" style={{
            display: "flex",
        }} className="mainContainer">
      <div id="mainContainerHas"/>
      {/* {context ? <div>{JSON.stringify(context)}</div> : <p>Loading data...</p>} */}
      <design_system_1.SubNav aria-label="Conversations sub nav">
        {/* <SubNavHeader label="Conversations" /> */}
        <design_system_1.SubNavSections>
          {Object.entries(formattedConvos)
            .sort(function (_a, _b) {
            var keyA = _a[0];
            var keyB = _b[0];
            var isSameType = typeInt(keyA) === typeInt(keyB);
            var dayStrings = [
                "today",
                "yesterday",
                "thisWeek",
                "thisMonth",
            ];
            if (isSameType) {
                var type = ["year", "month", "day"][typeInt(keyA + 1)];
                // If both are years, compare numerically
                if (type === "year") {
                    return Number(keyA) - Number(keyB);
                }
                // If both are months, compare by index of month
                if (type === "month") {
                    return (months.indexOf(keyA.toLowerCase()) -
                        months.indexOf(keyB.toLowerCase()));
                }
                if (type === "day") {
                    return dayStrings.indexOf(keyA) - dayStrings.indexOf(keyB);
                }
            }
            // console.log(
            //   { keyA, keyB },
            //   typeInt(keyA),
            //   typeInt(keyB),
            //   typeInt(keyA) - typeInt(keyB)
            // );
            return typeInt(keyA) - typeInt(keyB);
        })
            .reverse()
            .map(function (_a, idx) {
            var key = _a[0], convos = _a[1];
            var label = getTimeLabel(key);
            return (<design_system_1.SubNavSection className="subNavSection" key={"sbn-".concat(key)} label={label}>
                  {convos === null || convos === void 0 ? void 0 : convos.map(function (convo, _idx) {
                    return (<exports.ConvoTabText data-active={(currentConvoId === convo.id).toString()} onDelete={deleteConversation} onClick={setCurrentConvoId} key={"ctt-".concat(idx, "-").concat(_idx)} convo={convo}/>);
                })}
                </design_system_1.SubNavSection>);
        })}
        </design_system_1.SubNavSections>
      </design_system_1.SubNav>
      <div style={{
            flexBasis: 0,
            flexGrow: 1,
        }} className="superMain">
        <design_system_1.Main className="realMain">
          <design_system_1.ContentLayout>
            <header className="atlasHeader">
              <h1 className="atlasAiText">Atlas_4o-mini</h1>
            </header>
            <main className="contentContainer">
              {/* {currentConvoId === null ? () : ()} */}
              {currentConversation && (<div className={"chatItemsContainer"}>
                  {(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.content) &&
                currentConversation.content.map(function (response, index) {
                    return (
                    // @ts-ignore
                    <response_1.Response key={"".concat(index)}>{response}</response_1.Response>);
                })}
                  <div ref={messagesEndRef}/>
                </div>)}
            </main>
          </design_system_1.ContentLayout>
        </design_system_1.Main>
        <div className="stickyInputContainer">
          <design_system_1.Box>
            <form id="chatForm" onSubmit={function (e) {
            e.preventDefault();
            handlePromptSubmission(e);
        }}>
              <design_system_1.Grid data-component="real-input-container" className="realInputContainer" spacing={1} gap={2} paddingTop={4}>
                <design_system_1.GridItem col={11}>
                  <design_system_1.TextInput id="chatInput" placeholder={formatMessage({
            id: "strapi-supergpt.homePage.prompt.placeholder",
        })} aria-label="Content" name="prompt" error={error} onChange={handlePromptChange} value={prompt} disabled={loading} onPaste={function (e) {
            // e.preventDefault();
            setError("");
        }}/>
                </design_system_1.GridItem>
                <design_system_1.GridItem style={{
            justifyContent: "space-between",
            display: "flex",
            gap: "0.5rem",
        }}>
                  <design_system_1.Button size="L" name="prompt" startIcon={<icons_1.PaperPlane />} value="prompt" loading={loading} onClick={handlePromptSubmission}>
                    {formatMessage({
            id: "strapi-supergpt.homePage.prompt.button",
        })}
                  </design_system_1.Button>
                </design_system_1.GridItem>
              </design_system_1.Grid>
            </form>
          </design_system_1.Box>
        </div>
      </div>
    </design_system_1.Layout>
    // <div >
    // </div>
    );
}
exports.default = Home;
