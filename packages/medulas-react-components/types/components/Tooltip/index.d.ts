import * as React from "react";
interface Props {
  readonly children: React.ReactNode;
  readonly maxWidth?: number;
}
declare const Tooltip: ({ children, maxWidth }: Props) => JSX.Element;
export default Tooltip;
