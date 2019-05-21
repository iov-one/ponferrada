import { ConnectedRouter } from 'connected-react-router';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { PersonaProvider } from '../../context/PersonaProvider';
import { RequestProvider } from '../../context/RequestProvider';
import { Request } from '../../extension/background/actions/createPersona/requestHandler';
import { GetPersonaResponse } from '../../extension/background/messages';
import Route from '../../routes';
import { history } from '../../store/reducers';

export const createDom = (
  store: Store,
  requests: ReadonlyArray<Request> = [],
  persona: GetPersonaResponse = null,
): React.Component =>
  TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MedulasThemeProvider>
        <ToastProvider>
          <PersonaProvider persona={persona}>
            <RequestProvider initialRequests={requests}>
              <ConnectedRouter history={history}>
                <Route />
              </ConnectedRouter>
            </RequestProvider>
          </PersonaProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </Provider>,
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const expectRoute = (store: Store, route: string): void => {
  expect(store.getState().router.location.pathname).toBe(route);
};
