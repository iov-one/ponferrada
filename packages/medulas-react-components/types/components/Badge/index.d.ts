import { BadgeProps } from "@material-ui/core/Badge";
import React from "react";
interface Props extends Omit<BadgeProps, "variant"> {
  readonly variant: "dot" | "check" | "text";
  readonly invisible?: boolean;
  readonly children: React.ReactNode;
  readonly badgeContent?: string;
}
declare const BadgeIcon: ({ variant, invisible, color, badgeContent, children }: Props) => JSX.Element;
export default BadgeIcon;
