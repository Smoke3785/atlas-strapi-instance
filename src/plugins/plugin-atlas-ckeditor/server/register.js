"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    plugin: "plugin-atlas-ckeditor",
    name: "CKEditor",
    type: "richtext",
  });
};
