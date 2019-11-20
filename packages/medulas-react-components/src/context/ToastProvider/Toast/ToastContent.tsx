import { IconButton, makeStyles, SnackbarContent } from "@material-ui/core";
import classNames from "classnames";
import * as React from "react";

import Block from "../../../components/Block";
import Image from "../../../components/Image";
import Typography from "../../../components/Typography";
import CloseIcon from "../../../theme/assets/toast/close.svg";
import ErrorIcon from "../../../theme/assets/toast/error.svg";
import SuccessIcon from "../../../theme/assets/toast/success.svg";
import WarningIcon from "../../../theme/assets/toast/warning.svg";
import { ToastVariant } from "./index";

const variantIcon = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: SuccessIcon,
};

const useStyles = makeStyles({
  snackbarContent: {
    padding: "24px",
  },
  snackbarAction: {
    padding: 0,
    minWidth: "20px",
    minHeight: "20px",
  },
  success: {
    backgroundColor: "#09d69e",
  },
  error: {
    backgroundColor: "#f17f5c",
  },
  info: {
    backgroundColor: "#09d69e",
  },
  warning: {
    backgroundColor: "#ffb968",
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: "#fff",
  },
  iconBackground: {
    backgroundColor: "#f5f7f9",
  },
  closeButton: {
    padding: 0,
  },
});

interface Props {
  readonly className?: string;
  readonly message: string;
  readonly onClose: () => void;
  readonly variant: ToastVariant;
}

const ToastContent = React.forwardRef(
  ({ className, message, onClose, variant }: Props, ref?: React.Ref<any>): JSX.Element => {
    const Icon = variantIcon[variant];
    const classes = useStyles();

    const snackbarClasses = {
      root: classes.snackbarContent,
      action: classes.snackbarAction,
    };

    return (
      <SnackbarContent
        innerRef={ref}
        className={classNames(classes[variant], className)}
        classes={snackbarClasses}
        message={
          <Block display="flex" alignItems="center">
            <Block
              minWidth="48px"
              minHeight="48px"
              borderRadius="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={classes.iconBackground}
            >
              <Image src={Icon} alt="Toast icon" width={24} height={24} />
            </Block>
            <Block marginLeft={3} />
            <Typography variant="subtitle1" weight="semibold" className={classes.text}>
              {message}
            </Typography>
          </Block>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="secondary"
            className={classes.closeButton}
            onClick={onClose}
          >
            <Image src={CloseIcon} alt="Close" width={20} height={20} />
          </IconButton>,
        ]}
      />
    );
  },
);

export default ToastContent;
