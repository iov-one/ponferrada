import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from './routes';
import { WELCOME_ROUTE } from './routes/paths';
import { configureStore, history } from './store';
import { globalStyles } from './theme/globalStyles';

const store = configureStore();
const rootEl = document.getElementById('root');

//FIXME not redirecting to welcome on page load
history.push(WELCOME_ROUTE);

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
          <Component />
        </MedulasThemeProvider>
      </ConnectedRouter>
    </Provider>,
    rootEl
  );
};

render(Router);

if (module.hot) {
  module.hot.accept(
    './routes',
    (): void => {
      const NextApp = require('./routes').default;
      render(NextApp);
    }
  );
}
