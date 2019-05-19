import * as React from 'react';

import ThemeProvider from '../../theme/MedulasThemeProvider';

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => (
  <ThemeProvider injectFonts>{children}</ThemeProvider>
);
