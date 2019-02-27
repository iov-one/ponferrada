import * as React from "react";
import MedulasThemeProvider from "../../theme/MedulasThemeProvider";

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => (
  <MedulasThemeProvider injectGlobalStyle injectFonts>
    {children}
  </MedulasThemeProvider>
);
