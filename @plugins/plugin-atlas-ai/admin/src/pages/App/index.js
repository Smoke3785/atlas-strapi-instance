"use strict";
/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ConversationsLayout_1 = require("../../components/ConversationsLayout");
var helper_plugin_1 = require("@strapi/helper-plugin");
var react_router_dom_1 = require("react-router-dom");
var pluginId_1 = require("../../pluginId");
var App = function () {
    return (<div>
      {/* @ts-ignore */}
      <react_router_dom_1.Switch>
        {/* @ts-ignore */}
        <react_router_dom_1.Route render={function (props) { return (
        // @ts-ignore
        <ConversationsLayout_1.default routeComponentProps={props}/>); }} path={"/plugins/".concat(pluginId_1.default)}/>
        {/* @ts-ignore */}
        <react_router_dom_1.Route 
    // @ts-ignore
    component={function (props) {
            return (<div className="errorContainer" id="llm-error-occurred">
                <helper_plugin_1.AnErrorOccurred />
              </div>);
        }}/>
      </react_router_dom_1.Switch>
    </div>);
};
exports.default = App;
