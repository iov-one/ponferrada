import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import * as React from "react";
import { useField } from "react-final-form-hooks";

import { FieldInputValue } from "../../../utils/forms/validators";

interface InnerProps {
  readonly name: string;
  readonly form: FormApi;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly onChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

const TextField = ({ name, form, validate, onChanged, ...restProps }: Props): JSX.Element => {
  const { input, meta } = useField(name, form, validate);
  const error = meta.error && (meta.touched || !meta.pristine);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    input.onChange(event);

    if (onChanged) onChanged(event);
  };

  return (
    <MuiTextField
      error={error}
      name={input.name}
      value={input.value}
      helperText={error ? meta.error : undefined}
      onChange={handleChange}
      margin="normal"
      {...restProps}
    />
  );
};

export default TextField;
