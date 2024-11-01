"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: "POST",
        path: "/prompt",
        handler: "chatGptController.prompt",
        config: {
            policies: [],
        },
    },
    {
        method: "POST",
        path: "/generateName",
        handler: "chatGptController.generateName",
        config: {
            policies: [],
        },
    },
    {
        method: "POST",
        path: "/generateImage",
        handler: "chatGptController.createImage",
        config: {
            policies: [],
        },
    },
];
