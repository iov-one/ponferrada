import { PropTypes } from "@material-ui/core";
import React from "react";
interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly variant: "dot" | "check" | "text";
  readonly invisible?: boolean;
  readonly color?: PropTypes.Color | "error";
  readonly children: React.ReactNode;
  readonly badgeContent?: string;
}
declare const BadgeIcon: ({ variant, invisible, color, badgeContent, children }: Props) => JSX.Element;
export default BadgeIcon;
