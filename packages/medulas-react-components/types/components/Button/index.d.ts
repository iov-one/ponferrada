import { PropTypes } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
interface Props extends Omit<ButtonProps, "variant" | "color"> {
  readonly variant?: ButtonProps["variant"] | "continue";
  readonly spinner?: boolean;
  readonly children: React.ReactNode;
  readonly color?: PropTypes.Color | "inverted";
}
declare const Button: ({ children, variant, spinner, color, ...restProps }: Props) => JSX.Element;
export default Button;
