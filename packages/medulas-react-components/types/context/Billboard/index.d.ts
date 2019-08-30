import * as React from "react";
export interface BillboardContextInterface {
  readonly show: (message: React.ReactNode) => void;
  readonly close: () => void;
}
export declare const BillboardContext: React.Context<BillboardContextInterface>;
interface Props {
  readonly children: React.ReactNode;
}
export declare const BillboardProvider: ({ children }: Props) => JSX.Element;
export {};
