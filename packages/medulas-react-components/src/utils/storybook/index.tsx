import ThemeProvider from '../../theme/MedulasThemeProvider';
import * as React from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => (
  <ThemeProvider injectFonts>{children}</ThemeProvider>
);
