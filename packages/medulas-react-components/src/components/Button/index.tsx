import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";

const useStyles = makeStyles({
  label: {
    textTransform: "capitalize",
  },
});

const Button = ({ children }: ButtonProps): JSX.Element => {
  const classes = useStyles();

  return <MuiButton classes={classes}>{children}</MuiButton>;
};

export default Button;
