import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import React from 'react';
import icon from '../../assets/iov-logo.svg';
import { history } from '../../store/reducers';
import { PAYMENT_ROUTE } from '../paths';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import { sendSigningRequest } from '../../communication/signing';

const useStyles = makeStyles((theme: Theme) => ({
  welcome: {
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    padding: '50px',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const onPayment = (): void => {
  history.push(PAYMENT_ROUTE);
};

const Welcome = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const classes = useStyles();

  const onSigning = (): void => {
    toast.show('Testing interaction with extension. Check console, please.', ToastVariant.INFO);
    sendSigningRequest();
  };

  return (
    <Block
      width="100vw"
      height="auto"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.welcome}
    >
      <CircleImage alt="Logo" icon={icon} dia="200px" iconClasses={classes.icon} />
      <Block marginTop={5} marginBottom={5}>
        <Typography variant="h6">IOV Wallet</Typography>
      </Block>
      <Block display="flex">
        <Button className={classes.button} onClick={onPayment}>
          SEND PAYMENT
        </Button>
        <Button className={classes.button} onClick={onSigning}>
          SIGN REQUEST
        </Button>
      </Block>
    </Block>
  );
};

export default Welcome;
