import { MedulasThemeProvider, ToastProvider } from "medulas-react-components";
import * as React from "react";
import ReactDOM from "react-dom";

import { PersonaProvider } from "./context/PersonaProvider";
import { RequestProvider } from "./context/RequestProvider";
import { GetPersonaResponse } from "./extension/background/model/backgroundscript";
import { Request } from "./extension/background/model/requestsHandler/requestQueueManager";
import Route from "./routes";
import { initialUrl } from "./routes/paths";
import { globalStyles } from "./theme/globalStyles";
import { getHasStoredPersona, getPersonaData, getQueuedRequests } from "./utils/chrome";
import { history } from "./utils/history";

const rootEl = document.getElementById("root");

const render = (
  Component: React.ComponentType,
  hasStoredPersona: boolean,
  persona: GetPersonaResponse,
  requests: readonly Request[],
): void => {
  ReactDOM.render(
    <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
      <ToastProvider>
        <PersonaProvider persona={persona} hasStoredPersona={hasStoredPersona}>
          <RequestProvider initialRequests={requests}>
            <Component />
          </RequestProvider>
        </PersonaProvider>
      </ToastProvider>
    </MedulasThemeProvider>,
    rootEl,
  );
};

Promise.all([getPersonaData(), getHasStoredPersona()] as const).then(([persona, hasStoredPersona]) => {
  const requests = getQueuedRequests();
  const url = initialUrl(!!persona, hasStoredPersona);
  history.push(url);
  render(Route, hasStoredPersona, persona, requests);

  if (module.hot) {
    module.hot.accept("./routes", (): void => {
      const NextApp = require("./routes").default;
      render(NextApp, hasStoredPersona, persona, requests);
    });
  }
});
