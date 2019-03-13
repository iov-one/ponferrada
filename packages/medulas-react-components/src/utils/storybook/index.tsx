import ThemeProvider from '../../theme/MedulasThemeProvider';
import * as React from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => {
  return <ThemeProvider injectFonts>{children}</ThemeProvider>;
};
