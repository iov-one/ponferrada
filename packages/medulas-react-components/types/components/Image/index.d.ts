import * as React from "react";
export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly cover?: boolean;
  readonly alt: string;
  readonly fullwidth?: boolean;
  readonly bordered?: boolean;
  readonly noShrink?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}
declare const Image: ({
  fullwidth,
  alt,
  cover,
  bordered,
  noShrink,
  className,
  style,
  ...props
}: ImgProps) => JSX.Element;
export default Image;
