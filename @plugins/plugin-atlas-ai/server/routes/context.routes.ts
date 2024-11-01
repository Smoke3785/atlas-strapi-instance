export default [
  {
    method: "GET",
    path: "/context",
    handler: "contextController.getContext",
    config: {
      policies: [],
    },
  },
];
