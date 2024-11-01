module.exports = ({ env }) => ({
  //   "duplicate-button": true,
  //   "prev-next-button": true,
  //   "react-icons": true,
  //   "file-system": {
  //     enabled: true,
  //   },
  //   "soft-delete": {
  //     enabled: true,
  //   },
  //   "strapi-plugin-lottie": {
  //     enabled: true,
  //   },
  //   redirects: {
  //     enabled: true,
  //   },
  //   "import-export-entries": {
  //     enabled: true,
  //     config: {
  //       // See `Config` section.
  //     },
  //   },
  //   chartbrew: true,
  //   "content-versioning": {
  //     enabled: true,
  //   },
  //   "rest-cache": {
  //     config: {
  //       provider: {
  //         name: "memory",
  //         options: {
  //           max: 32767,
  //           maxAge: 3600,
  //         },
  //       },
  //       strategy: {
  //         contentTypes: [
  //           // list of Content-Types UID to cache
  //           "api::site-config.site-config",
  //           "api::article.article",
  //           // Must add menu plugin
  //         ],
  //       },
  //     },
  //   },
  //   "email-designer": {
  //     enabled: true,
  //   },
  //   plausible: {
  //     config: {
  //       sharedLink: env("PLAUSIBLE_SHARED_LINK"),
  //     },
  //   },
  //   placeholder: {
  //     enabled: true,
  //     config: {
  //       size: 10,
  //     },
  //   },
  //   scheduler: {
  //     enabled: true,
  //     config: { contentTypes: { "api::page.page": {} } },
  //   },
  //   menus: {
  //     config: {
  //       maxDepth: 2,
  //     },
  //   },
  //   upload: {
  //     config: {
  //       providerOptions: {
  //         api_secret: env("CLOUDINARY_SECRET"),
  //         cloud_name: env("CLOUDINARY_NAME"),
  //         api_key: env("CLOUDINARY_KEY"),
  //       },
  //       provider: "cloudinary",
  //       actionOptions: {
  //         upload: {},
  //         delete: {},
  //       },
  //     },
  //   },
  //   // ATLAS PLUGINS - ILIAD
  //   "plugin-atlas-docs": {
  //     resolve: "./src/plugins/plugin-atlas-docs",
  //     enabled: true,
  //   },
  //   "plugin-atlas-ai": {
  //     resolve: "./src/plugins/plugin-atlas-ai",
  //     enabled: true,
  //   },
  "plugin-atlas-ckeditor": {
    resolve: "./src/plugins/plugin-atlas-ckeditor",
    enabled: true,
  },
  // "strapi-plugin-ratings": {
  //   resolve: "./src/plugins/strapi-plugin-ratings",
  //   enabled: true,
  // },
  redirects: {
    resolve: "./src/plugins/strapi-redirects",
    enabled: true,
  },
  //   "plugin-atlas-core": {
  //     resolve: "./src/plugins/plugin-atlas-core",
  //     enabled: true,
  //   },
  //   "plugin-atlas-socketio": {
  //     resolve: "./src/plugins/plugin-atlas-socketio",
  //     enabled: true,
  //     config: {
  //       // This will listen for all supported events on the article content type
  //       contentTypes: ["api::article.article"],
  //     },
  //   },
});
