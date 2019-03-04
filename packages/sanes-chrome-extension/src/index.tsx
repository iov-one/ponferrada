import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import Route from './routes';
import { history } from './store/reducers';
import { HOME_ROUTE } from './routes/paths';

const store = new Store();

const rootEl = document.getElementById('root');

store.ready().then(() => {
  history.push(HOME_ROUTE);

  const Root = (): JSX.Element => (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route />
      </ConnectedRouter>
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
