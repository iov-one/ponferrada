import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Route from '../../routes';
import { history } from '../../store/reducers';

export const createDom = (store: Store): React.Component =>
  TestUtils.renderIntoDocument(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route />
      </ConnectedRouter>
    </Provider>
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const expectRoute = (store: Store, route: string): void => {
  expect(store.getState().router.location.pathname).toBe(route);
};
