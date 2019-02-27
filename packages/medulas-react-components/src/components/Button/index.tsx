import * as React from "react";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";

const Button = ({ children }: ButtonProps): JSX.Element => {
  return <MuiButton>{children}</MuiButton>;
};

export default Button;
