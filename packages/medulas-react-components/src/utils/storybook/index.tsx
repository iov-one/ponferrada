import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import ThemeProvider from '../../theme/MedulasThemeProvider';
import theme from '../../theme/utils/mui';

interface Props {
  readonly children: React.ReactNode;
}

const globalStyles = makeStyles({
  '@global': {
    'html, body': {
      width: '350px',
      height: '500px',
      '-ms-overflow-style': '-ms-autohiding-scrollbar',
      fontSize: '10px',
    },
    'a:-webkit-any-link': {
      color: 'inherit',
    },
    body: {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      overflowX: 'hidden',
      fontFamily: "'Muli', sans-serif",
      margin: 0,
      backgroundColor: theme.palette.background.default,
      textRendering: 'geometricPrecision',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
  },
});

export const Storybook = ({ children }: Props): JSX.Element => (
  <ThemeProvider injectFonts injectStyles={globalStyles}>
    {children}
  </ThemeProvider>
);
