import { ThemeProvider } from '@material-ui/styles';
import * as React from 'react';
import theme from './utils/mui';
import { globalStyles } from './utils/globalStyles';

interface Props {
  readonly injectFonts?: boolean;
  readonly injectGlobalStyle?: boolean;
  readonly children: React.ReactNode;
}

const MedulasThemeProvider = ({
  injectFonts = true,
  injectGlobalStyle = false,
  children,
}: Props): JSX.Element => {
  if (injectGlobalStyle) {
    globalStyles();
  }

  if (injectFonts) {
    require('./utils/fonts.css');
  }

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default MedulasThemeProvider;
