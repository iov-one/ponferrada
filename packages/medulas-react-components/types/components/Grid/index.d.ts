import { ComposedStyleFunction, flexbox, PropsFor, sizing } from "@material-ui/system";
import * as React from "react";
declare type GridStyleFunction = ComposedStyleFunction<[typeof flexbox, typeof sizing]>;
declare type GridStyleProps = PropsFor<GridStyleFunction>;
interface Props extends GridStyleProps {
  readonly children?: React.ReactNode;
}
declare const Grid: ({ children, ...restProps }: Props) => JSX.Element;
export default Grid;
