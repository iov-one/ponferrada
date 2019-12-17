import LuxonUtils from "@date-io/luxon";
import {
  BaseDateTimePickerProps,
  DateTimePicker as MuiDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import * as React from "react";
import { useField } from "react-final-form-hooks";

import { FieldInputValue } from "../../../utils/forms/validators";

export const getNextMinuteDate = (): Date => new Date(new Date().getTime() + 60 * 1000);

interface InnerProps {
  readonly name: string;
  readonly form: FormApi;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly onChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly subscription?: FieldSubscription;
}

type Props = InnerProps & BaseDateTimePickerProps;

const DateTimePicker = ({ name, form, validate, onChanged, ...restProps }: Props): JSX.Element => {
  const { input, meta } = useField(name, form, validate);
  const error = meta.error && (meta.touched || !meta.pristine);
  const value = input.value ? input.value : getNextMinuteDate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    input.onChange(event);

    if (onChanged) onChanged(event);
  };

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <MuiDateTimePicker
        error={error}
        name={input.name}
        value={value}
        helperText={error ? meta.error : undefined}
        onChange={handleChange}
        margin="none"
        {...restProps}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateTimePicker;
