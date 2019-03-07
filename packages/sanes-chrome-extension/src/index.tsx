import 'medulas-react-components/lib/utils/bootstrap';
import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import Route from './routes';
import { history } from './store/reducers';
import { WELCOME_ROUTE } from './routes/paths';

const store = new Store();

const rootEl = document.getElementById('root');

store.ready().then(() => {
  history.push(WELCOME_ROUTE);

  const Root = (): JSX.Element => (
    <Provider store={store}>
      <MedulasThemeProvider injectGlobalStyle injectFonts>
        <ConnectedRouter history={history}>
          <Route />
        </ConnectedRouter>
      </MedulasThemeProvider>
    </Provider>
  );

  ReactDOM.render(<Root />, rootEl);

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const NextApp = require('./routes').default;
      ReactDOM.render(<NextApp />, rootEl);
    });
  }
});
