"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("../../package.json");
var pluginId = package_json_1.default.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');
exports.default = pluginId;
