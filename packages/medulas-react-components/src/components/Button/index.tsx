import { PropTypes } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Theme } from "@material-ui/core/styles";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React from "react";

import Block from "../Block";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "rgba(49, 230, 201, 0.15)",
  },
  label: {
    color: theme.palette.primary.main,
  },
  contained: {
    "&:hover": {
      backgroundColor: "rgba(49, 230, 201, 0.15)",
    },
  },
}));

interface Props extends Omit<ButtonProps, "variant" | "color"> {
  readonly variant?: ButtonProps["variant"] | "continue";
  readonly spinner?: boolean;
  readonly children: React.ReactNode;
  readonly color?: PropTypes.Color | "inverted";
}

const Button = ({ children, variant, spinner, color, ...restProps }: Props): JSX.Element => {
  const muiVariant: ButtonProps["variant"] = variant && variant === "continue" ? "contained" : variant;
  let classes: ReturnType<typeof useStyles> | undefined = useStyles();

  let muiColor: PropTypes.Color | undefined;
  if (color === "inverted") {
    muiColor = "default";
  } else {
    muiColor = color;
    classes = undefined;
  }

  return (
    <MuiButton variant={muiVariant} color={muiColor} {...restProps} classes={classes}>
      {spinner && (
        <Block display="flex" marginRight={2}>
          <CircularProgress size={22} color="inherit" />
        </Block>
      )}
      {children}
      {variant === "continue" && <ArrowForwardIcon fontSize="small" />}
    </MuiButton>
  );
};

export default Button;
