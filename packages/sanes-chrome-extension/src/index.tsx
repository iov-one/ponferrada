import { ConnectedRouter } from 'connected-react-router';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { PersonaProvider } from './context/PersonaProvider';
import { GetPersonaResponse, sendGetPersonaMessage } from './extension/background/messages';
import Route from './routes';
import { ACCOUNT_STATUS_ROUTE, WELCOME_ROUTE } from './routes/paths';
import { makeStore } from './store';
import { history } from './store/reducers';
import { globalStyles } from './theme/globalStyles';

const rootEl = document.getElementById('root');
const store = makeStore();

const render = (Component: React.ComponentType, persona: GetPersonaResponse): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <ToastProvider>
          <PersonaProvider persona={persona}>
            <ConnectedRouter history={history}>
              <Component />
            </ConnectedRouter>
          </PersonaProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
    rootEl,
  );
};

sendGetPersonaMessage().then(persona => {
  render(Route, persona);

  const url = persona ? ACCOUNT_STATUS_ROUTE : WELCOME_ROUTE;
  history.push(url);

  if (module.hot) {
    module.hot.accept(
      './routes',
      (): void => {
        const NextApp = require('./routes').default;
        render(NextApp, persona);
      },
    );
  }
});
