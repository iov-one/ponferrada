import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

import { FormApi, FieldSubscription, FieldState } from 'final-form';
import { NonFunctionProperties } from 'react-final-form-hooks';

interface InnerProps {
  name: string;
  form: FormApi;
  meta: NonFunctionProperties<FieldState>;
  subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

const TextFieldForm = ({ meta, ...restProps }: Props): JSX.Element => {
  const error = meta.error && (meta.touched || !meta.pristine);

  return <MuiTextField error={error} {...restProps} />;
};

export default TextFieldForm;
