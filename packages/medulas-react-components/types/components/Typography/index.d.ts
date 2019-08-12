import { TypographyProps } from "@material-ui/core/Typography";
declare type Weight = "light" | "regular" | "semibold";
interface StyleProps {
  readonly weight?: Weight;
}
interface Props extends TypographyProps, StyleProps {
  readonly inline?: boolean;
  readonly link?: boolean;
}
declare const Typography: ({ children, inline, link, className, weight, ...restProps }: Props) => JSX.Element;
export default Typography;
