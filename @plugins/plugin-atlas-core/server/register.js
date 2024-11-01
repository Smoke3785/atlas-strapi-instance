"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var strapi = _a.strapi;
    strapi.customFields.register({
        plugin: "plugin-atlas-core",
        name: "ElectronRelation",
        type: "richtext",
    });
});
