import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import Routes from '../../routes';

export const createDom = (store: Store): React.Component =>
  TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MedulasThemeProvider>
        <Routes />
      </MedulasThemeProvider>
    </Provider>,
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const expectRoute = (route: string): void => {
  const actualRoute = window.location.pathname;
  expect(actualRoute).toBe(route);
};
