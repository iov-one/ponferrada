import ThemeProvider from '../../theme/MedulasThemeProvider';
import { Provider } from 'react-redux';
import { createMemoryHistory, History } from 'history';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createStore, combineReducers } from 'redux';
import * as React from 'react';

const history = createMemoryHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

const store = createStore(createRootReducer(history));

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <ThemeProvider injectFonts>
        <ConnectedRouter history={history}>
          <React.Fragment>{children}</React.Fragment>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
};
