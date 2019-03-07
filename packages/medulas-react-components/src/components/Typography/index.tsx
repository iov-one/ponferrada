import * as React from 'react';
import MuiTypography, { TypographyProps } from '@material-ui/core/Typography';

export const Typography = ({
  children,
  ...restProps
}: TypographyProps): JSX.Element => {
  return <MuiTypography {...restProps}>{children}</MuiTypography>;
};
