import * as React from "react";
import { ToastVariant } from "./Toast";
export interface ToastContextInterface {
  readonly show: (message: string, variant: ToastVariant) => void;
  readonly close: () => void;
}
export declare const ToastContext: React.Context<ToastContextInterface>;
interface Props {
  readonly children: React.ReactNode;
}
export declare const ToastProvider: ({ children }: Props) => JSX.Element;
export {};
