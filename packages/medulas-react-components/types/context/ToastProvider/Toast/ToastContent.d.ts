import * as React from "react";
import { ToastVariant } from "./index";
interface Props {
  readonly className?: string;
  readonly message: string;
  readonly onClose: () => void;
  readonly variant: ToastVariant;
}
declare const ToastContent: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
export default ToastContent;
