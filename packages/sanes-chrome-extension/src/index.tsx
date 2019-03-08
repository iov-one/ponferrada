import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import Route from './routes';
import { history } from './store/reducers';
import { WELCOME_ROUTE } from './routes/paths';
import { globalStyles } from './globalStyles';

const store = new Store();

const rootEl = document.getElementById('root');

store.ready().then(() => {
  history.push(WELCOME_ROUTE);

  const render = (Component: React.ComponentType): void => {
    return ReactDOM.render(
      <Provider store={store}>
        <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </MedulasThemeProvider>
      </Provider>,
      rootEl
    );
  };

  render(Route);

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const NextApp = require('./routes').default;
      render(NextApp);
    });
  }
});
