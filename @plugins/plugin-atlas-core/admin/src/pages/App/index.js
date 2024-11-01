"use strict";
/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var helper_plugin_1 = require("@strapi/helper-plugin");
var pluginId_1 = require("../../pluginId");
var HomePage_1 = require("../HomePage");
var App = function () {
    return (<div>
      {/* @ts-ignore */}
      <react_router_dom_1.Switch>
        {/* @ts-ignore */}
        <react_router_dom_1.Route path={"/plugins/".concat(pluginId_1.default)} component={HomePage_1.default} exact/>
        {/* @ts-ignore */}
        <react_router_dom_1.Route component={helper_plugin_1.AnErrorOccurred}/>
      </react_router_dom_1.Switch>
    </div>);
};
exports.default = App;
