import { InputBaseProps } from "@material-ui/core/InputBase";
import { FieldSubscription, FormApi } from "final-form";
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
}: Props) => JSX.Element;
export default SelectFieldForm;
