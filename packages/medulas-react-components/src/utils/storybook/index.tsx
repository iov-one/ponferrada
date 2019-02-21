import { MuiThemeProvider } from "@material-ui/core";
import * as React from "react";
import theme from "../../theme/mui";

import "../../index.css";
import "./index.css";

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);
