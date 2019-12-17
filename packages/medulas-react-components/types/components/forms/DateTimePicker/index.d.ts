import { BaseDateTimePickerProps } from "@material-ui/pickers";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import * as React from "react";
import { FieldInputValue } from "../../../utils/forms/validators";
export declare const getNextMinuteDate: () => Date;
interface InnerProps {
  readonly name: string;
  readonly form: FormApi;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly onChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly subscription?: FieldSubscription;
}
declare type Props = InnerProps & BaseDateTimePickerProps;
declare const DateTimePicker: ({ name, form, validate, onChanged, ...restProps }: Props) => JSX.Element;
export default DateTimePicker;
