import "../bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import theme from "../../theme/mui";
import { globalStyles } from "../../theme/globalStyles";

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props): JSX.Element => {
  globalStyles();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
