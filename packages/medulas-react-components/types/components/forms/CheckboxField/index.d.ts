import { CheckboxProps } from "@material-ui/core/Checkbox";
import { FieldSubscription, FormApi } from "final-form";
import * as React from "react";
interface Props extends Omit<CheckboxProps, "form"> {
  readonly fieldName: string;
  readonly label?: React.ReactNode | string;
  readonly initial: boolean;
  readonly form: FormApi;
  readonly onChangeCallback?: (checked: boolean) => void;
  readonly subscription?: FieldSubscription;
}
declare const CheckboxField: ({ fieldName, form, initial, onChangeCallback, label }: Props) => JSX.Element;
export default CheckboxField;
