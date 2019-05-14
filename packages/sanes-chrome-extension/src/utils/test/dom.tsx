import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import TestUtils from 'react-dom/test-utils';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Route from '../../routes';
import { history } from '../../store/reducers';
import { PersonaProvider } from '../../context/PersonaProvider';

export const createDom = (store: Store): React.Component =>
  TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MedulasThemeProvider>
        <ConnectedRouter history={history}>
          <ToastProvider>
            <PersonaProvider persona={null}>
              <Route />
            </PersonaProvider>
          </ToastProvider>
        </ConnectedRouter>
      </MedulasThemeProvider>
    </Provider>,
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const expectRoute = (store: Store, route: string): void => {
  expect(store.getState().router.location.pathname).toBe(route);
};
