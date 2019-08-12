import { ImgProps } from "../Image";
interface Props extends ImgProps {
  readonly icon: string;
  readonly dia: number | string;
  readonly borderColor?: string;
  readonly circleColor?: string;
  readonly iconClasses?: string;
}
declare const CircleImage: ({
  borderColor,
  circleColor,
  icon,
  dia,
  iconClasses,
  ...props
}: Props) => JSX.Element;
export default CircleImage;
