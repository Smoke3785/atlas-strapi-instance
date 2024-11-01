"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var strapi = _a.strapi;
    return ({
        index: function (ctx) {
            ctx.body = strapi
                .plugin('plugin-atlas-core')
                .service('myService')
                .getWelcomeMessage();
        },
    });
});
