import { makeStyles, Theme } from "@material-ui/core";
import Badge, { BadgeProps } from "@material-ui/core/Badge";
import React from "react";

import CheckIcon from "../../theme/assets/badgeIcon/check.svg";
import Img from "../Image";

interface Props extends Omit<BadgeProps, "variant"> {
  readonly variant: "dot" | "check" | "text";
  readonly invisible?: boolean;
  readonly children: React.ReactNode;
  readonly badgeContent?: string;
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
  text: {
    fontSize: "1.2rem",
    position: "initial",
    transform: "initial",
    marginLeft: `${theme.spacing(0.5)}px`,
    zIndex: 0,
  },
  textRoot: {
    position: "initial",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const BadgeIcon = ({
  variant,
  invisible = false,
  color = "primary",
  badgeContent = "",
  children,
}: Props): JSX.Element => {
  const classes = useStyles();

  const badgeClasses = { badge: classes[variant], root: variant === "text" ? classes.textRoot : undefined };
  const content = variant === "check" ? <Img src={CheckIcon} alt="Badge Icon" /> : badgeContent;

  const badgeVariant = variant === "dot" ? "dot" : "standard";
  const badgeColor = variant === "check" ? "default" : color;

  if (invisible) {
    return <React.Fragment>{children}</React.Fragment>;
  } else {
    return (
      <Badge badgeContent={content} classes={badgeClasses} variant={badgeVariant} color={badgeColor}>
        {children}
      </Badge>
    );
  }
};

export default BadgeIcon;
