import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import { Provider } from 'react-redux';
import { createMemoryHistory, History } from 'history';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createStore, combineReducers } from 'redux';
import * as React from 'react';
import { PersonaProvider } from '../../context/PersonaProvider';

export const CHROME_EXTENSION_ROOT = 'Extension';

const storybookHistory = createMemoryHistory();

//eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const storybookCreateRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

const storybookStore = createStore(storybookCreateRootReducer(storybookHistory));

interface Props {
  readonly children: React.ReactNode;
}

export const SanesStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={storybookStore}>
      <ConnectedRouter history={storybookHistory}>
        <Storybook>
          <ToastProvider>
            <PersonaProvider persona={null}>{children}</PersonaProvider>
          </ToastProvider>
        </Storybook>
      </ConnectedRouter>
    </Provider>
  );
};
