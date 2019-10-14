import React from "react";
export declare type VPosition = "center" | "start" | "end";
export declare type HPosition = "center" | "flex-start" | "flex-end";
interface Props {
  readonly show: boolean;
  readonly message: React.ReactNode;
  readonly children: React.ReactNode;
  readonly vPosition: VPosition;
  readonly hPosition: HPosition;
}
declare function Billboard({ show, children, message, hPosition, vPosition }: Props): JSX.Element;
export default Billboard;
