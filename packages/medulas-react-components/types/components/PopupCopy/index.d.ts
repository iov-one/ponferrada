import * as React from "react";
interface Props {
  readonly children: React.ReactNode;
  readonly textToCopy: string;
  readonly maxWidth?: number;
  readonly onMouseEnter?: () => void;
  readonly onMouseLeave?: () => void;
}
declare const PopupCopy: ({
  children,
  textToCopy,
  maxWidth,
  onMouseEnter,
  onMouseLeave,
}: Props) => JSX.Element;
export default PopupCopy;
