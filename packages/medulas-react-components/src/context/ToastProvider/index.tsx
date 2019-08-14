import * as React from "react";
import { singleton } from "ui-logic";

import { Toast, ToastVariant } from "./Toast";

export interface ToastContextInterface {
  readonly show: (message: string, variant: ToastVariant) => void;
  readonly close: () => void;
}

export const ToastContext = React.createContext<ToastContextInterface>({
  show: (): void => {},
  close: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
}

interface ToastState {
  readonly open: boolean;
  readonly message?: string;
  readonly variant?: ToastVariant;
}

export const ToastProvider = ({ children }: Props): JSX.Element => {
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
  });

  const showToast = (message: string, variant: ToastVariant): void =>
    setToast({
      message,
      variant,
      open: true,
    });

  const closeToast = (): void =>
    setToast({
      open: false,
    });

  const toastConfig = {
    show: showToast,
    close: closeToast,
  };

  const invariantToastConfig = singleton((toastConfig): ToastContextInterface => toastConfig);

  return (
    <ToastContext.Provider value={invariantToastConfig(toastConfig)}>
      <Toast {...toast} onClose={closeToast} />
      {children}
    </ToastContext.Provider>
  );
};
