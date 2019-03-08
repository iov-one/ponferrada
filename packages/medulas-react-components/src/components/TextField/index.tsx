import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

const TextField = ({ children, ...restProps }: TextFieldProps): JSX.Element => {
  return <MuiTextField {...restProps}>{children}</MuiTextField>;
};

export default TextField;
