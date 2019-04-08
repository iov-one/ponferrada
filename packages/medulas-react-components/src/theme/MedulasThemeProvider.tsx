import * as React from 'react';
import theme from './utils/mui';
import { ThemeProvider } from '@material-ui/styles';

interface Props {
  readonly injectFonts?: boolean;
  readonly injectStyles?: (props?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  readonly children: React.ReactNode;
}

const MedulasThemeProvider = ({
  injectFonts = true,
  injectStyles,
  children,
}: Props): JSX.Element => {
  if (injectStyles) {
    injectStyles();
  }

  if (injectFonts) {
    require('./utils/fonts.css');
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MedulasThemeProvider;
