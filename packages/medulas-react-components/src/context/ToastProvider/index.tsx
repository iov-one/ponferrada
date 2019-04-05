import * as React from 'react';
import { Toast } from './Toast';

export enum ToastVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

const SharedToast = (): JSX.Element => (
  <ToastConsumer>
    {({ open, message, onClose, variant }: ToastContextInterface) => {
      return (
        <Toast
          open={open}
          onClose={onClose}
          message={message}
          variant={variant}
        />
      );
    }}
  </ToastConsumer>
);

export interface ToastContextInterface {
  readonly showToast: (message: string, variant: ToastVariant) => void;
  readonly onClose: () => void;
  readonly open: boolean;
  readonly message: string;
  readonly variant: ToastVariant;
}

const ToastContext = React.createContext<ToastContextInterface>({
  showToast: (message: string, variant: ToastVariant) => ({ message, variant }),
  onClose: () => null,
  open: false,
  message: '',
  variant: ToastVariant.INFO,
});

interface Props {
  readonly children: React.ReactNode;
}

interface ToastState {
  readonly open: boolean;
  readonly message: string;
  readonly variant: ToastVariant;
}

export const ToastProvider = ({ children }: Props): JSX.Element => {
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: '',
    variant: ToastVariant.INFO,
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
