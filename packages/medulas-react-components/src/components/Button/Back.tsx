import MuiButton, { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';

const Back = ({ children, ...restProps }: ButtonProps): JSX.Element => (
  <MuiButton {...restProps} variant="text" aria-label="Go back">
    {children}
  </MuiButton>
);

export default Back;
