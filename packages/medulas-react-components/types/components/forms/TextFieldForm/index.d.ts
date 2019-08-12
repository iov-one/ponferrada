import { TextFieldProps } from "@material-ui/core/TextField";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import { FieldInputValue } from "~/utils/forms/validators";
interface InnerProps {
  name: string;
  form: FormApi;
  validate?: FieldValidator<FieldInputValue>;
  subscription?: FieldSubscription;
}
declare type Props = InnerProps & TextFieldProps;
declare const TextFieldForm: ({ name, form, validate, ...restProps }: Props) => JSX.Element;
export default TextFieldForm;
