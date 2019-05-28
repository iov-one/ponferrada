import { IconButton, SnackbarContent, Theme, createStyles, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';
import Block from '../../../components/Block';
import Image from '../../../components/Image';
import Typography from '../../../components/Typography';
import CloseIcon from '../../../theme/assets/toast/close.svg';
import ErrorIcon from '../../../theme/assets/toast/error.svg';
import SuccessIcon from '../../../theme/assets/toast/success.svg';
import WarningIcon from '../../../theme/assets/toast/warning.svg';
import { ToastVariant } from './index';

const variantIcon = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: SuccessIcon,
};

const useStyles = makeStyles(
  (theme: Theme): ReturnType<typeof createStyles> => ({
    success: {
      color: theme.palette.primary.main,
    },
    error: {
      color: '#F05956',
    },
    info: {
      color: theme.palette.secondary.main,
    },
    warning: {
      color: theme.palette.error.main,
    },
    icon: {
      fontSize: 30,
    },
    iconVariant: {},
    message: {
      alignItems: 'center',
      display: 'flex',
    },
    iconBackground: {
      backgroundColor: '#f5f7f9',
      height: 60,
      minWidth: 60,
      borderRadius: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: `${theme.spacing(3)}px`,
    },
  }),
);

interface Props {
  readonly className?: string;
  readonly message: string;
  readonly onClose: () => void;
  readonly variant: ToastVariant;
}

const ToastContent = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ className, message, onClose, variant }: Props, ref?: React.Ref<any>): JSX.Element => {
    const Icon = variantIcon[variant];
    const classes = useStyles();

    return (
      <SnackbarContent
        innerRef={ref}
        className={classNames(classes[variant], className)}
        message={
          <Block className={classes.message} flexGrow={1}>
            <div className={classes.iconBackground}>
              <Image src={Icon} alt="Toast icon" width={24} height={24} />
            </div>

            <Typography variant="subtitle1" className={classes[variant]}>
              {message}
            </Typography>
          </Block>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="secondary" onClick={onClose}>
            <Image src={CloseIcon} alt="Close" width={20} height={20} />
          </IconButton>,
        ]}
      />
    );
  },
);

export default ToastContent;
