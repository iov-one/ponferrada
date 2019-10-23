import { Theme } from "@material-ui/core/styles";
import MuiTypography, { TypographyProps } from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import classNames from "classnames";
import * as React from "react";

import { defaultColor } from "../../theme/utils/variables";

type Weight = "light" | "regular" | "semibold";

interface StyleProps {
  readonly weight?: Weight;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  inline: {
    display: "inline",
  },
  link: {
    textDecoration: "underline",
    cursor: "pointer",
  },
  defaultColor: {
    color: defaultColor,
  },
  weight: props => ({
    fontWeight:
      props.weight === "light"
        ? theme.typography.fontWeightLight
        : props.weight === "semibold"
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  }),
}));

interface Props extends StyleProps, Omit<TypographyProps, "color"> {
  readonly color?: TypographyProps["color"] | "default";
  readonly inline?: boolean;
  readonly link?: boolean;
}

const Typography = ({
  children,
  inline,
  link,
  className,
  weight,
  color = "default",
  ...restProps
}: Props): JSX.Element => {
  const classes = useStyles({ weight });
  const compositeClass = classNames(className, weight ? classes.weight : undefined, {
    [classes.inline]: inline,
    [classes.link]: link,
    [classes.defaultColor]: color === "default",
  });

  const typographyColor = color === "default" ? undefined : color;

  return (
    <MuiTypography className={compositeClass} color={typographyColor} {...restProps}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
