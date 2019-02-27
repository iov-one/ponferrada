import React from "react";
import { makeStyles } from "@material-ui/styles";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";

const useStyles = makeStyles({
  label: {
    fontFamily: "'Muli', sans-serif",
    textTransform: "capitalize",
  },
});

export default function Button({ children }: ButtonProps): JSX.Element {
  const classes = useStyles();

  return <MuiButton classes={classes}>{children}</MuiButton>;
}
