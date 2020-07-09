import { MedulasThemeProvider } from "medulas-react-components";
import * as React from "react";
import TestUtils from "react-dom/test-utils";
import { Provider } from "react-redux";
import { Store } from "redux";

import Routes from "../../routes";

export const createDom = (store: Store): React.Component =>
  TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MedulasThemeProvider>
        <Routes />
      </MedulasThemeProvider>
    </Provider>,
  ) as any;

export const expectRoute = (route: string): void => {
  const actualRoute = window.location.pathname;
  expect(actualRoute).toBe(route);
};

export const click = async (element: Element): Promise<void> => {
  const onClick = async (): Promise<void> =>
    TestUtils.Simulate.click(element, {
      button: 0,
    });

  await TestUtils.act(onClick as any);
};
