import { ConnectedRouter } from 'connected-react-router';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { PersonaProvider } from '../../context/PersonaProvider';
import { RequestProvider } from '../../context/RequestProvider';
import { GetPersonaResponse } from '../../extension/background/model/backgroundscript';
import { Request } from '../../extension/background/model/signingServer/requestQueueManager';
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
  ) as any;

export const click = (element: Element): void => {
  TestUtils.act(() => TestUtils.Simulate.click(element));
};

export const input = (field: Element, value: any): void => {
  TestUtils.act(() => {
    TestUtils.Simulate.change(field, {
      target: { value } as any,
    });
  });
};

export const check = (checkbox: Element): void => {
  TestUtils.act(() => {
    TestUtils.Simulate.change(checkbox, {
      target: { checked: true } as any,
    });
  });
};

export const submit = (form: Element): void => {
  TestUtils.act(() => TestUtils.Simulate.submit(form));
};
