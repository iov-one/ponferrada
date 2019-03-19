import * as React from 'react';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

import { FormApi, FieldSubscription } from 'final-form';

interface InnerProps {
  name: string;
  form: FormApi;
  subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

const TextFieldForm = ({ ...restProps }: Props): JSX.Element => {
  return <MuiTextField {...restProps} />;
};

export default TextFieldForm;
