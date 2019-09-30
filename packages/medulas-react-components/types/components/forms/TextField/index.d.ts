import { TextFieldProps } from "@material-ui/core/TextField";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import * as React from "react";
import { FieldInputValue } from "../../../utils/forms/validators";
interface InnerProps {
  readonly name: string;
  readonly form: FormApi;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly onChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly subscription?: FieldSubscription;
}
declare type Props = InnerProps & TextFieldProps;
declare const TextField: ({ name, form, validate, onChanged, ...restProps }: Props) => JSX.Element;
export default TextField;
