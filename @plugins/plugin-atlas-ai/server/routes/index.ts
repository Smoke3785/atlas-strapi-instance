import chatGptRoutes from "./chat.gpt.routes";
import contextRoutes from "./context.routes";
import convoRoutes from "./convo.routes";
import cacheRoutes from "./cache.routes";

export default [
  ...contextRoutes,
  ...chatGptRoutes,
  ...convoRoutes,
  ...cacheRoutes,
];
