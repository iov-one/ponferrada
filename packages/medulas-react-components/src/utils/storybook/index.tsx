import "../bootstrap";
import { ThemeProvider, makeStyles } from "@material-ui/styles";
import * as React from "react";
import theme from "../../theme/mui";
import { globalStyles } from "../../theme/globalStyles";

const storyBookStyles = makeStyles({
  '@global': {
    "body>div:nth-child(3)": {
      display: "flex",
      minHeight: "100%",
    }
  }
});

interface Props {
  readonly children: React.ReactNode;
}

export const Storybook = ({ children }: Props) => {
  globalStyles();
  storyBookStyles();

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
