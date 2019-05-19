import { FieldSubscription, FieldValidator, FormApi } from 'final-form';
import * as React from 'react';
import { useField } from 'react-final-form-hooks';

import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

interface InnerProps {
  name: string;
  form: FormApi;
  validate?: FieldValidator;
  subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

const TextFieldForm = ({ name, form, validate, ...restProps }: Props): JSX.Element => {
  const { input, meta } = useField(name, form, validate);
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
