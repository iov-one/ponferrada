import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
interface Props extends Omit<ButtonProps, "variant"> {
  readonly variant?: ButtonProps["variant"] | "continue";
  readonly spinner?: boolean;
  readonly children: React.ReactNode;
}
declare const Button: ({ children, variant, spinner, ...restProps }: Props) => JSX.Element;
export default Button;
