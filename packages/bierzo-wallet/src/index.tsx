import * as Sentry from '@sentry/browser';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './routes';
import { configureStore } from './store';
import { globalStyles } from './theme/globalStyles';

Sentry.init({
  dsn: 'https://6f1aa71313e14f81b9b663d831705ff6@sentry.io/1374813',
});

const store = configureStore();
const rootEl = document.getElementById('root');

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <ToastProvider>
          <Component />
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
    rootEl,
  );
};

render(Routes);

if (module.hot) {
  module.hot.accept(
    './routes',
    (): void => {
      const NextApp = require('./routes').default;
      render(NextApp);
    },
  );
}
