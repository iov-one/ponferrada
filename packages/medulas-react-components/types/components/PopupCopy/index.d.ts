import * as React from "react";
interface Props {
  readonly children: React.ReactNode;
  readonly textToCopy: string;
  readonly maxWidth?: number;
}
declare const PopupCopy: ({ children, textToCopy, maxWidth }: Props) => JSX.Element;
export default PopupCopy;
