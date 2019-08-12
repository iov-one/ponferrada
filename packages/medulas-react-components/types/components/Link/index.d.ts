import * as React from "react";
import { LinkProps } from "react-router-dom";
interface Props extends LinkProps {
  readonly children: React.ReactNode;
}
declare const Link: ({ children, to, ...rest }: Props) => JSX.Element;
export default Link;
