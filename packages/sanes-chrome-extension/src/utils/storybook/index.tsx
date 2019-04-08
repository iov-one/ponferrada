import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { Provider } from 'react-redux';
import { createMemoryHistory, History } from 'history';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createStore, combineReducers } from 'redux';
import * as React from 'react';

const history = createMemoryHistory();

//eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

const store = createStore(createRootReducer(history));

interface Props {
  readonly children: React.ReactNode;
}

export const SanesStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Storybook>{children}</Storybook>
      </ConnectedRouter>
    </Provider>
  );
};
