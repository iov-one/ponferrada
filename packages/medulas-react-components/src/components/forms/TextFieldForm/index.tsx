import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

import { FormApi, FieldSubscription } from 'final-form';
import { useField } from 'react-final-form-hooks';

interface InnerProps {
  name: string;
  form: FormApi;
  meta: NonFunctionProperties<FieldState>;
  subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

const TextFieldForm = ({ name, form, ...restProps }: Props): JSX.Element => {
  const { input, meta } = useField(name, form);
  const error = meta.error && (meta.touched || !meta.pristine);

  return (
    <MuiTextField
      error={error}
      name={input.name}
      helperText={error ? meta.error : undefined}
      onChange={input.onChange}
      margin="normal"
      {...restProps}
    />
  );
};

export default TextFieldForm;
