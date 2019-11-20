import { makeStyles } from "@material-ui/core";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import * as React from "react";

import ToastContent from "./ToastContent";

const useStyles = makeStyles({
  snackbarRoot: {
    left: 0,
    right: 0,
  },
  snackbarOrigin: {
    bottom: 0,
  },
});

export enum ToastVariant {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info",
}

const anchorProps: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly message?: string;
  readonly variant?: ToastVariant;
}

export const Toast = ({ open, onClose, message = "", variant = ToastVariant.INFO }: Props): JSX.Element => {
  const classes = useStyles();
  const snackbarClasses = {
    root: classes.snackbarRoot,
    anchorOriginBottomRight: classes.snackbarOrigin,
  };

  return (
    <Snackbar
      id="toast-provider"
      anchorOrigin={anchorProps}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      classes={snackbarClasses}
    >
      {open ? <ToastContent onClose={onClose} variant={variant} message={message} /> : <SnackbarContent />}
    </Snackbar>
  );
};
