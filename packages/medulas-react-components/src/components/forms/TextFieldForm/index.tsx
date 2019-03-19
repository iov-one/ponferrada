import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useField } from 'react-final-form-hooks';
import { FormApi, FieldSubscription } from 'final-form';

interface Props extends TextFieldProps {
  children: React.ReactNode;
  name: string;
  form: FormApi;
  subscription: FieldSubscription;
}

const TextFieldForm = ({ children, ...restProps }: Props): JSX.Element => {
  return <MuiTextField {...restProps}>{children}</MuiTextField>;
};

export default TextFieldForm;
