import { ConnectedRouter } from "connected-react-router";
import { ToastProvider } from "medulas-react-components/lib/context/ToastProvider";
import MedulasThemeProvider from "medulas-react-components/lib/theme/MedulasThemeProvider";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { PersonaProvider } from "./context/PersonaProvider";
import { RequestProvider } from "./context/RequestProvider";
import { GetPersonaResponse } from "./extension/background/model/backgroundscript";
import { Request } from "./extension/background/model/signingServer/requestQueueManager";
import Route from "./routes";
import { ACCOUNT_STATUS_ROUTE, LOGIN_ROUTE, WELCOME_ROUTE } from "./routes/paths";
import { makeStore } from "./store";
import { history } from "./store/reducers";
import { globalStyles } from "./theme/globalStyles";
import { getPersonaData, getQueuedRequests, hasStoredPersona } from "./utils/chrome";

const rootEl = document.getElementById("root");
const store = makeStore();

const render = (
  Component: React.ComponentType,
  persona: GetPersonaResponse,
  requests: ReadonlyArray<Request>,
): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <ToastProvider>
          <PersonaProvider persona={persona}>
            <RequestProvider initialRequests={requests}>
              <ConnectedRouter history={history}>
                <Component />
              </ConnectedRouter>
            </RequestProvider>
          </PersonaProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
    rootEl,
  );
};

getPersonaData().then(persona => {
  const requests = getQueuedRequests();
  render(Route, persona, requests);

  hasStoredPersona().then(hasPersona => {
    const url = persona ? ACCOUNT_STATUS_ROUTE : hasPersona ? LOGIN_ROUTE : WELCOME_ROUTE;
    history.push(url);

    if (module.hot) {
      module.hot.accept("./routes", (): void => {
        const NextApp = require("./routes").default;
        render(NextApp, persona, requests);
      });
    }
  });
});
