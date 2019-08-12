import { PropTypes } from "@material-ui/core";
import React from "react";
interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly variant: "dot" | "check";
  readonly invisible?: boolean;
  readonly color?: PropTypes.Color | "error";
  readonly children: React.ReactNode;
}
declare const BadgeIcon: ({ variant, invisible, color, children }: Props) => JSX.Element;
export default BadgeIcon;
