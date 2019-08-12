import { SwitchProps } from "@material-ui/core/Switch";
interface Props extends SwitchProps {
  readonly label?: string;
}
declare const Switch: ({ label, ...restProps }: Props) => JSX.Element;
export default Switch;
