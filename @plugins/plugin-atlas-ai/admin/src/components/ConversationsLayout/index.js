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
exports.formatConvos = exports.getTimeLabel = void 0;
// Hooks / Functions
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_intl_1 = require("react-intl");
// Utils
var frontendUtils_1 = require("../../utils/frontendUtils");
// Icons
var icons_1 = require("@strapi/icons");
var react_router_dom_2 = require("react-router-dom");
var helper_plugin_1 = require("@strapi/helper-plugin");
var ConversationPage_1 = require("../ConversationPage");
// UI Library Components
var design_system_1 = require("@strapi/design-system");
var CreateNewPage_1 = require("../CreateNewPage");
var icons_2 = require("@strapi/icons");
// UI Components
var ConversationLabelButton_1 = require("../ConversationLabelButton");
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
    if (isYear(value)) {
        return -1;
    }
    if (isMonth(value)) {
        return 0;
    }
    return 1;
}
function superSortConvos(formattedConvos) {
    return Object.entries(formattedConvos)
        .sort(function (_a, _b) {
        var keyA = _a[0];
        var keyB = _b[0];
        var isSameType = typeInt(keyA) === typeInt(keyB);
        var dayStrings = ["today", "yesterday", "thisWeek", "thisMonth"];
        if (isSameType) {
            var type = ["year", "month", "day"][typeInt(keyA + 1)];
            // If both are years, compare numerically
            if (type === "year") {
                return Number(keyA) - Number(keyB);
            }
            // If both are months, compare by index of month
            if (type === "month") {
                return (months.indexOf(keyB.toLowerCase()) -
                    months.indexOf(keyA.toLowerCase()));
            }
            if (type === "day") {
                return dayStrings.indexOf(keyA) - dayStrings.indexOf(keyB);
            }
        }
        return typeInt(keyA) - typeInt(keyB);
    })
        .reverse();
}
function Home(_a) {
    var _this = this;
    var routeComponentProps = _a.routeComponentProps;
    // Hooks
    var formatMessage = (0, react_intl_1.useIntl)().formatMessage;
    var history = (0, react_router_dom_1.useHistory)();
    // Dashboard State
    var _b = (0, react_1.useState)(null), currentConvoId = _b[0], setCurrentConvoId = _b[1];
    var _c = (0, react_1.useState)([]), convos = _c[0], setConvos = _c[1]; // All conversations - TODO: Should refactor so only the current conversation is retrieved in its entirety. Chat window should be turned into a component, perhaps.
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1]; // Loading state
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
                    // If the current conversation is not in the list of conversations, navigate to the root page.
                    if (currentConvoId &&
                        !_conversations.some(function (convo) { return convo.id === currentConvoId; })) {
                        history.push("".concat(routeComponentProps.match.path));
                        setCurrentConvoId(null);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var deleteConversation = (0, react_1.useCallback)(function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, frontendUtils_1.instance.delete("/plugin-atlas-ai/convo/".concat(id))];
                case 1:
                    _a.sent();
                    // Update optimistically on the client-side
                    setConvos(function (prevConvos) {
                        var _a, _b, _c;
                        var updatedConvos = prevConvos.filter(function (convo) { return convo.id !== id; });
                        if (updatedConvos.length === 0) {
                            history.push("".concat(routeComponentProps.match.path));
                        }
                        else {
                            var components = (_a = history.location.pathname) === null || _a === void 0 ? void 0 : _a.split("/");
                            if (((_c = (_b = components === null || components === void 0 ? void 0 : components[(components === null || components === void 0 ? void 0 : components.length) - 1]) === null || _b === void 0 ? void 0 : _b.split("-")) === null || _c === void 0 ? void 0 : _c[0]) ===
                                id.toString()) {
                                history.push("".concat(routeComponentProps.match.path));
                            }
                        }
                        return updatedConvos;
                    });
                    // Refetch conversations to update the UI
                    refetchConversations();
                    return [2 /*return*/, {
                            error: null,
                            data: null,
                        }];
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
    (0, react_1.useEffect)(function () {
        var currentConvoId = frontendUtils_1.utils.getIdFromPathname(history.location.pathname);
        if (currentConvoId === -1) {
            return;
        }
        setCurrentConvoId(currentConvoId);
    }, [history]);
    // Derived State
    var formattedConvos = formatConvos(convos);
    return (<design_system_1.Layout data-component="ism-layout" style={{
            display: "flex",
        }} className="mainContainer">
      <div id="mainContainerHas"/>
      {/* {context ? <div>{JSON.stringify(context)}</div> : <p>Loading data...</p>} */}
      <design_system_1.SubNav title={"Atlas AI"} aria-label="Conversations sub nav">
        {/* <SubNavHeader label="Conversations" /> */}
        <design_system_1.SubNavSections>
          <design_system_1.SubNavSection className="subNavSection header" id="llm-subnav-header">
            {[
            {
                name: "New Conversation",
                id: "new-conversation",
                icon: <icons_1.PlusCircle />,
                to: "/",
            },
            {
                to: "/plugins/plugin-atlas-docs",
                name: "About Atlas",
                id: "atlas-docs",
                icon: <icons_2.Paragraph />,
                escape: true,
            },
            {
                to: "/content-manager/singleType/api::static-llm-snippet.static-llm-snippet",
                name: "Manage Snippets",
                id: "llm-snippets",
                escape: true,
                icon: <icons_1.Cog />,
            },
        ].map(function (_a, idx) {
            var to = _a.to, name = _a.name, icon = _a.icon, escape = _a.escape, id = _a.id;
            var root = escape ? "" : routeComponentProps.match.path;
            return (
            // @ts-ignore
            <react_router_dom_2.Link key={idx} id={"btn-".concat(id)} className="rd-link headerLink" to={"".concat(root).concat(to)}>
                  <div className="content">
                    <div className="icon">{icon}</div>
                    <p className="convoTabText ">{name}</p>
                  </div>
                </react_router_dom_2.Link>);
        })}
          </design_system_1.SubNavSection>
          {formattedConvos ? (<>
              {superSortConvos(formattedConvos).map(function (_a, idx) {
                var key = _a[0], convos = _a[1];
                var label = getTimeLabel(key);
                return (<design_system_1.SubNavSection className="subNavSection" key={"sbn-".concat(key)} label={label}>
                    {convos === null || convos === void 0 ? void 0 : convos.sort(function (a, b) {
                        return (new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime());
                    }).map(function (convo, _idx) {
                        return (<ConversationLabelButton_1.ConversationLabelButton data-active={(currentConvoId === convo.id).toString()} root={routeComponentProps.match.path} onDelete={deleteConversation} onClick={setCurrentConvoId} key={"ctt-".concat(idx, "-").concat(_idx)} convo={convo}/>);
                    })}
                  </design_system_1.SubNavSection>);
            })}
            </>) : (<div id="sideNavLoadingContainer" className="loadingContainer">
              <design_system_1.Loader />
            </div>)}
        </design_system_1.SubNavSections>
      </design_system_1.SubNav>
      <div style={{
            flexBasis: 0,
            flexGrow: 1,
        }} className="superMain">
        {/* @ts-ignore */}
        <react_router_dom_2.Switch>
          {/* @ts-ignore */}
          <react_router_dom_2.Route path={"".concat(routeComponentProps.match.path, "/conversations/:id")} component={function (props) {
            return (
            // @ts-ignore
            <ConversationPage_1.default refetchConversations={refetchConversations} routeComponentProps={props}/>);
        }}/>
          {/* @ts-ignore */}
          <react_router_dom_2.Route path={"".concat(routeComponentProps.match.path)} component={function (props) {
            // @ts-ignore
            return (<CreateNewPage_1.default refetchConversations={refetchConversations} routeComponentProps={props}/>);
        }} 
    // @ts-ignore
    note="this will match the new-conversation page" exact/>
          {/* @ts-ignore */}
          {/* <Route
                path={`${routeComponentProps.match.path}`}
                component={AnErrorOccurred}
                // @ts-ignore
                note="this is the path that will eventually access the other ai-related pages."
                exact
                /> */}
          {/* @ts-ignore */}
          <react_router_dom_2.Route 
    // @ts-ignore
    component={function (props) {
            return (<div className="errorContainer" id="llm-error-occurred">
                  <helper_plugin_1.AnErrorOccurred />
                </div>);
        }}/>{" "}
        </react_router_dom_2.Switch>
      </div>
    </design_system_1.Layout>
    // <div >
    // </div>
    );
}
exports.default = Home;
