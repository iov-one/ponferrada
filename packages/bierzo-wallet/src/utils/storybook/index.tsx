import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '../../store';
import { globalStyles } from '../../theme/globalStyles';

export const WALLET_ROOT = 'Bierzo wallet';

const store = configureStore();

interface Props {
  readonly children: React.ReactNode;
}

const DecoratedStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <MemoryRouter>{children}</MemoryRouter>
      </MedulasThemeProvider>
    </Provider>
  );
};

export default DecoratedStorybook;
