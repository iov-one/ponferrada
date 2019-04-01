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

export const findRenderedDOMComponentWithId = (
  tree: React.Component<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  id: string
): Element => {
  const elementsWithId = TestUtils.findAllInRenderedTree(
    tree,
    (inst: React.ReactInstance) => {
      return TestUtils.isDOMComponent(inst) && inst.id === id;
    }
  );

  if (!elementsWithId || elementsWithId.length === 0) {
    throw new Error(`Element with id "${id}" not found`);
  }

  if (elementsWithId.length > 1) {
    throw new Error(
      `Too many elements with id "${id}" was found (${elementsWithId.length})`
    );
  }

  return elementsWithId[0] as Element;
};
