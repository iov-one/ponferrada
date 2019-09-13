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
import { getPersonaData, getQueuedRequests, hasStoredPersona } from "./utils/chrome";
import { history } from "./utils/history";

const rootEl = document.getElementById("root");

const render = (
  Component: React.ComponentType,
  hasPersona: boolean,
  persona: GetPersonaResponse,
  requests: readonly Request[],
): void => {
  ReactDOM.render(
    <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
      <ToastProvider>
        <PersonaProvider persona={persona} hasPersona={hasPersona}>
          <RequestProvider initialRequests={requests}>
            <Component />
          </RequestProvider>
        </PersonaProvider>
      </ToastProvider>
    </MedulasThemeProvider>,
    rootEl,
  );
};

type PersonaContexType = [GetPersonaResponse, boolean];

Promise.all([getPersonaData(), hasStoredPersona()]).then(([persona, hasPersona]: PersonaContexType) => {
  const requests = getQueuedRequests();
  const hasRequests = requests.length > 0;
  const url = initialUrl(!!persona, hasPersona, hasRequests);
  history.push(url);
  render(Route, hasPersona, persona, requests);

  if (module.hot) {
    module.hot.accept("./routes", (): void => {
      const NextApp = require("./routes").default;
      render(NextApp, hasPersona, persona, requests);
    });
  }
});
