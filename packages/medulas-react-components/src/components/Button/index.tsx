import { Omit } from '@material-ui/core';
import MuiButton, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';

import Block from '../Block';

interface Props extends Omit<ButtonProps, 'variant'> {
  readonly variant?: ButtonProps['variant'] | 'continue';
  readonly spinner?: boolean;
  readonly children: React.ReactNode;
}

const Button = ({ children, variant, spinner, ...restProps }: Props): JSX.Element => {
  const muiVariant: ButtonProps['variant'] = variant && variant === 'continue' ? 'contained' : variant;

  return (
    <MuiButton variant={muiVariant} {...restProps}>
      {spinner && (
        <Block marginRight={2}>
          <CircularProgress size={22} color="inherit" />
        </Block>
      )}
      {children}
      {variant === 'continue' && <ArrowForwardIcon fontSize="small" />}
    </MuiButton>
  );
};

export default Button;
