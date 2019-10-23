import { TypographyProps } from "@material-ui/core/Typography";
declare type Weight = "light" | "regular" | "semibold";
interface StyleProps {
  readonly weight?: Weight;
}
interface Props extends StyleProps, Omit<TypographyProps, "color"> {
  readonly color?: TypographyProps["color"] | "default";
  readonly inline?: boolean;
  readonly link?: boolean;
}
declare const Typography: ({
  children,
  inline,
  link,
  className,
  weight,
  color,
  ...restProps
}: Props) => JSX.Element;
export default Typography;
