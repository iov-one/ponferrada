import * as React from "react";
import { HPosition, VPosition } from "./Billboard";
export interface BillboardContextInterface {
  readonly show: (
    message: React.ReactNode,
    vPosition: VPosition,
    hPosition: HPosition,
    delay: number,
  ) => void;
  readonly close: () => void;
}
export declare const BillboardContext: React.Context<BillboardContextInterface>;
interface Props {
  readonly children: React.ReactNode;
}
export declare function BillboardProvider({ children }: Props): JSX.Element;
export {};
