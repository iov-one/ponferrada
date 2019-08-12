import { FormApi } from "final-form";
interface Props {
  readonly icon: "white" | "black";
  readonly nextMsg: string;
  readonly onSubmit: (values: object) => void;
  readonly formRender?: (form: FormApi) => JSX.Element;
  readonly validation?: (values: object) => object | Promise<object>;
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly subtitle: string;
  readonly renderHeader?: () => JSX.Element;
}
declare const Layout: ({
  formRender,
  onSubmit,
  icon,
  primaryTitle,
  secondaryTitle,
  subtitle,
  nextMsg,
  renderHeader,
}: Props) => JSX.Element;
export default Layout;
