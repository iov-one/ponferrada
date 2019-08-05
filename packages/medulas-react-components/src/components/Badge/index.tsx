import { Badge, makeStyles, PropTypes, Theme } from "@material-ui/core";
import React from "react";

import CheckIcon from "../../theme/assets/badgeIcon/check.svg";
import Img from "../Image";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly variant: "dot" | "check";
  readonly invisible?: boolean;
  readonly color?: PropTypes.Color | "error";
  readonly children: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  check: {
    width: "25px",
    height: "25px",
    top: "-8px",
    right: "-8px",
  },
  dot: {
    width: "7px",
    height: "7px",
    top: "-7px",
    right: "-7px",
    zIndex: 0,
  },
}));

const BadgeIcon = ({ variant, invisible = false, color = "primary", children }: Props): JSX.Element => {
  const classes = useStyles();

  const badgeClasses = { badge: variant === "check" ? classes.check : classes.dot };
  const badgeContent = variant === "check" ? <Img src={CheckIcon} alt="Badge Icon" /> : "";

  const badgeVariant = variant === "check" ? "standard" : "dot";
  const badgeColor = variant === "check" ? "default" : color;

  return (
    <Badge
      badgeContent={badgeContent}
      classes={badgeClasses}
      invisible={invisible}
      variant={badgeVariant}
      color={badgeColor}
    >
      {children}
    </Badge>
  );
};

export default BadgeIcon;
