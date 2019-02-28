import * as React from "react";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";

const Button = ({ children, ...restProps }: ButtonProps): JSX.Element => {
  return <MuiButton {...restProps}>{children}</MuiButton>;
};

export default Button;
