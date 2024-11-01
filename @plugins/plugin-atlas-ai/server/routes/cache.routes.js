"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: "GET",
        path: "/cache",
        handler: "cacheController.getConfig",
        config: {
            policies: [],
        },
    },
    {
        method: "POST",
        path: "/cache/update",
        handler: "cacheController.updateConfig",
        config: {
            policies: [],
        },
    },
];
