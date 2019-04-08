import * as React from 'react';
import { Toast, ToastVariant } from './Toast';
import { singleton } from '../../utils/singleton';

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
      message: '',
      open: false,
      variant: ToastVariant.INFO,
    });

  const toastConfig = {
    showToast: showToast,
    onClose: closeToast,
    open: toast.open,
    message: toast.message,
    variant: toast.variant,
  };

  return (
    <ToastContext.Provider value={toastConfig}>
      <SharedToast />
      {children}
    </ToastContext.Provider>
  );
};

export const ToastConsumer = ToastContext.Consumer;
