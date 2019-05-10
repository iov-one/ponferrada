import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Route from './routes';
import { history } from './store/reducers';
import { WELCOME_ROUTE } from './routes/paths';
import { globalStyles } from './theme/globalStyles';
import { PersonaProvider } from './context/PersonaProvider';
import { makeStore } from './store';

const rootEl = document.getElementById('root');
const store = makeStore();

history.push(WELCOME_ROUTE);

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

render(Route);

if (module.hot) {
  module.hot.accept(
    './routes',
    (): void => {
      const NextApp = require('./routes').default;
      render(NextApp);
    }
  );
}
