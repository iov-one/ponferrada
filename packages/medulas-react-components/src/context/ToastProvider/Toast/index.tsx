import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import * as React from 'react';
import ToastContent from './ToastContent';

export enum ToastVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

const anchorProps: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly message: string;
  readonly variant: ToastVariant;
}

export const Toast = ({
  open,
  onClose,
  message,
  variant,
}: Props): JSX.Element => {
  return (
    <Snackbar
      anchorOrigin={anchorProps}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <ToastContent onClose={onClose} variant={variant} message={message} />
    </Snackbar>
  );
};
