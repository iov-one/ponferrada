import { PublicIdentity } from '@iov/bcp';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import React from 'react';
import * as ReactRedux from 'react-redux';
import icon from '../../assets/iov-logo.svg';
import { generateGetIdentitiesRequest, sendGetIdentitiesRequest } from '../../communication/identities';
import { sendSignAndPostRequest } from '../../communication/signAndPost';
import { getExtensionStatus } from '../../communication/status';
import { history } from '../../routes';
import { setExtensionStateAction } from '../../store/reducers/extension';
import { PAYMENT_ROUTE } from '../paths';

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
  //TODO: Fix this as soon as proper react-redux definitions will be available
  const dispatch = (ReactRedux as any).useDispatch();

  const onConnect = async (): Promise<void> => {
    const request = generateGetIdentitiesRequest();
    const result = await getExtensionStatus(request);
    dispatch(setExtensionStateAction(result.connected, result.installed));
  };

  const onSendRequestToBeSigned = async (): Promise<void> => {
    toast.show('Interaction with extension, fetching identities. Check the icon, please', ToastVariant.INFO);

    let identities: readonly PublicIdentity[] = [];

    try {
      identities = await sendGetIdentitiesRequest();
      if (identities.length === 0) {
        toast.show('Request for identities rejected', ToastVariant.WARNING);
        return;
      }
      toast.show('Request for identities accepted', ToastVariant.SUCCESS);
    } catch (error) {
      toast.show(error, ToastVariant.ERROR);
      return;
    }

    try {
      const transactionId = await sendSignAndPostRequest(identities[0]);
      toast.show(`Transaction successful with ID: ${transactionId.slice(0, 10)}...`, ToastVariant.SUCCESS);
    } catch (error) {
      toast.show('Request rejected', ToastVariant.ERROR);
    }
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
        <Button className={classes.button} onClick={onSendRequestToBeSigned}>
          SEND REQUEST TO BE SIGNED
        </Button>
        <Button className={classes.button} onClick={onConnect}>
          CHECK CONNECTION
        </Button>
      </Block>
    </Block>
  );
};

export default Welcome;
