import { InputBaseProps } from "@material-ui/core/InputBase";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import { FieldInputValue } from "../../../utils/forms/validators";
export interface Item {
  readonly name: string;
  readonly additionalText?: string;
}
interface InnerProps {
  readonly fieldName: string;
  readonly initial: string;
  readonly form: FormApi;
  readonly onChangeCallback?: (value: Item) => void;
  readonly subscription?: FieldSubscription;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly items: readonly Item[];
  readonly maxWidth?: string;
}
export declare type Props = InnerProps & InputBaseProps;
declare const SelectFieldForm: ({
  fieldName,
  form,
  initial,
  items,
  onChangeCallback,
  maxWidth,
  validate,
}: Props) => JSX.Element;
export default SelectFieldForm;
