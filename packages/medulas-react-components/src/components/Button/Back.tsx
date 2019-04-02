import * as React from 'react';
import MuiButton, { ButtonProps } from '@material-ui/core/Button';

const Back = ({ children, ...restProps }: ButtonProps): JSX.Element => (
  <MuiButton {...restProps} variant="text">
    {children}
  </MuiButton>
);

export default Back;
