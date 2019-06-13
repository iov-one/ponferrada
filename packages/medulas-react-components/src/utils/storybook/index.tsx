import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import ThemeProvider from '../../theme/MedulasThemeProvider';
import theme from '../../theme/utils/mui';

interface Props {
  readonly children: React.ReactNode;
}

const globalStyles = makeStyles({
  '@global': {
    '*': {
      boxSizing: 'inherit',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    '*::before, *::after': {
      boxSizing: 'inherit',
    },
    html: {
      fontSize: '62.5%',
    },
    body: {
      margin: '0',
      padding: '0',
      bottom: '0',
      top: '0',
      left: '0',
      right: '0',
      overflowX: 'hidden',
      fontFamily: '"Muli", sans-serif',
      boxSizing: 'border-box',
    },
  },
});

export const Storybook = ({ children }: Props): JSX.Element => (
  <ThemeProvider injectFonts injectStyles={globalStyles}>
    {children}
  </ThemeProvider>
);
