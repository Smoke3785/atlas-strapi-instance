/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import ConversationsLayout from "../../components/ConversationsLayout";
import { AnErrorOccurred } from "@strapi/helper-plugin";
import { Switch, Route } from "react-router-dom";
import pluginId from "../../pluginId";

const App = () => {
  return (
    <div>
      {/* @ts-ignore */}
      <Switch>
        {/* @ts-ignore */}
        <Route
          render={(props) => (
            // @ts-ignore
            <ConversationsLayout routeComponentProps={props} />
          )}
          path={`/plugins/${pluginId}`}
        />
        {/* @ts-ignore */}
        <Route
          // @ts-ignore
          component={(props) => {
            return (
              <div className="errorContainer" id="llm-error-occurred">
                <AnErrorOccurred />
              </div>
            );
          }}
        />
      </Switch>
    </div>
  );
};

export default App;
