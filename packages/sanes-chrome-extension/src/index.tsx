/*global chrome*/
import { ConnectedRouter } from 'connected-react-router';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersonaProvider } from './context/PersonaProvider';
import { RequestProvider } from './context/RequestProvider';
import { Request } from './extension/background/actions/createPersona/requestHandler';
import { GetPersonaResponse, sendGetPersonaMessage } from './extension/background/messages';
import { IovWindowExtension } from './extension/backgroundscript';
import Route from './routes';
import { ACCOUNT_STATUS_ROUTE, WELCOME_ROUTE } from './routes/paths';
import { makeStore } from './store';
import { history } from './store/reducers';
import { globalStyles } from './theme/globalStyles';

const rootEl = document.getElementById('root');
const store = makeStore();

const render = (
  Component: React.ComponentType,
  persona: GetPersonaResponse,
  requests: ReadonlyArray<Request>,
): void => {
  console.log('root index.tsx with requests: ' + requests.length);

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

sendGetPersonaMessage().then(persona => {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const requests = extensionWindow.getQueuedRequests();
  render(Route, persona, requests);

  const url = persona ? ACCOUNT_STATUS_ROUTE : WELCOME_ROUTE;
  history.push(url);

  if (module.hot) {
    module.hot.accept(
      './routes',
      (): void => {
        const NextApp = require('./routes').default;
        render(NextApp, persona, requests);
      },
    );
  }
});
