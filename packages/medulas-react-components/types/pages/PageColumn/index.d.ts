import { FormApi } from "final-form";
interface Props {
  readonly icon: "white" | "black";
  readonly primaryNextLabel: string;
  readonly primaryNextClicked: (values: object) => void;
  readonly secondaryNextLabel?: string;
  readonly secondaryNextClicked?: () => void;
  readonly formRender?: (form: FormApi) => JSX.Element;
  readonly validation?: (values: object) => object | Promise<object>;
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly subtitle: string;
  readonly renderHeader?: () => JSX.Element;
}
declare const PageColumn: ({
  formRender,
  icon,
  primaryTitle,
  secondaryTitle,
  subtitle,
  primaryNextLabel,
  primaryNextClicked,
  secondaryNextLabel,
  secondaryNextClicked,
  renderHeader,
}: Props) => JSX.Element;
export default PageColumn;
