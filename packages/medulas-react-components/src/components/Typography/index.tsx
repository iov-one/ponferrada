import * as React from "react";
import MuiTypography, { TypographyProps } from "@material-ui/core/Typography";

const Typography = ({ children, ...restProps }: TypographyProps): JSX.Element => {
  return <MuiTypography {...restProps}>{children}</MuiTypography>;
};

export default Typography;
