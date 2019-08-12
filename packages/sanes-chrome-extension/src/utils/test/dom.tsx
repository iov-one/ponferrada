import { ConnectedRouter } from "connected-react-router";
import { MedulasThemeProvider, ToastProvider } from "medulas-react-components";
import * as React from "react";
import TestUtils from "react-dom/test-utils";
import { Provider } from "react-redux";
import { Store } from "redux";

import { PersonaProvider } from "../../context/PersonaProvider";
import { RequestProvider } from "../../context/RequestProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { Request } from "../../extension/background/model/signingServer/requestQueueManager";
import Route from "../../routes";
import { history } from "../../store/reducers";

export const createDom = (
  store: Store,
  requests: readonly Request[] = [],
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

export const click = async (element: Element): Promise<void> => {
  const onClick = async (): Promise<void> =>
    TestUtils.Simulate.click(element, {
      button: 0,
    });

  await TestUtils.act(onClick as any);
};

export const input = (field: Element, value: any): void => {
  TestUtils.act(() => {
    TestUtils.Simulate.change(field, {
      target: { value } as any,
    });
  });
};

export const check = async (checkbox: Element): Promise<void> => {
  const onCheck = async (): Promise<void> =>
    TestUtils.Simulate.change(checkbox, {
      target: { checked: true } as any,
    });

  await TestUtils.act(onCheck as any);
};

export const submit = async (form: Element): Promise<void> => {
  const onSubmit = async (): Promise<void> => TestUtils.Simulate.submit(form);

  await TestUtils.act(onSubmit as any);
};
