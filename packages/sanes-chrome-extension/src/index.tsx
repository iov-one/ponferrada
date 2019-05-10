import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersonaProvider } from './context/PersonaProvider';
import { sendGetPersonaMessage } from './extension/messages';
import Route from './routes';
import { WELCOME_ROUTE, ACCOUNT_STATUS_ROUTE } from './routes/paths';
import { makeStore } from './store';
import { history } from './store/reducers';
import { globalStyles } from './theme/globalStyles';

const rootEl = document.getElementById('root');
const store = makeStore();

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <ToastProvider>
          <PersonaProvider>
            <ConnectedRouter history={history}>
              <Component />
            </ConnectedRouter>
          </PersonaProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
    rootEl
  );
};

Promise.resolve(sendGetPersonaMessage).then(persona => {
  render(Route);

  const url = persona ? ACCOUNT_STATUS_ROUTE : WELCOME_ROUTE;
  history.push(url);
});

if (module.hot) {
  module.hot.accept(
    './routes',
    (): void => {
      const NextApp = require('./routes').default;
      render(NextApp);
    }
  );
}
