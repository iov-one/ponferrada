import { ConnectedRouter } from 'connected-react-router';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '../../store';
import { history } from '../../store/reducers';
import { globalStyles } from '../../theme/globalStyles';

export const WALLET_ROOT = 'Bierzo wallet';

const store = configureStore();

interface Props {
  readonly children: React.ReactNode;
}

const DecoratedStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
          {children}
        </MedulasThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default DecoratedStorybook;
