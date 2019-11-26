import {
  border,
  borders,
  ComposedStyleFunction,
  display,
  flexbox,
  palette,
  positions,
  PropsFor,
  sizing,
  spacing,
  typography,
} from "@material-ui/system";
import * as React from "react";
declare type BlockStyleFunction = ComposedStyleFunction<
  [
    typeof flexbox,
    typeof sizing,
    typeof spacing,
    typeof display,
    typeof border,
    typeof positions,
    typeof palette,
    typeof borders,
    typeof typography,
  ]
>;
declare type BlockStyleProps = PropsFor<BlockStyleFunction>;
interface Props extends BlockStyleProps {
  readonly children?: React.ReactNode;
  readonly id?: string;
  readonly className?: string;
  readonly onClick?: React.MouseEventHandler<Element>;
  readonly onMouseLeave?: React.MouseEventHandler<Element>;
}
declare const Block: ({ children, display, ...restProps }: Props) => JSX.Element;
export default Block;
