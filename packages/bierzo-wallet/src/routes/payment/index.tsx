import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import React from 'react';

import { history } from '..';
//import { sendSignAndPostRequest } from '../../communication/signAndPost';
import PageMenu from '../../components/PageMenu';
import { PAYMENT_ROUTE } from '../paths';
import Layout from './components';

function onCancelPayment(): void {
  history.push(PAYMENT_ROUTE);
}

const Payment = (): JSX.Element => {
  const toast = React.useContext(ToastContext);

  const onSubmit = async (values: object): Promise<void> => {
    console.log('onSubmit');
    console.log(values);
    /*const formValues = values as FormValues;

    const keys = store.getState().extension.keys;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));

    try {
      const transactionId = await sendSignAndPostRequest(identities[0]);
      if (transactionId === null) {
        toast.show('Request rejected', ToastVariant.ERROR);
      } else {
        toast.show(`Transaction successful with ID: ${transactionId.slice(0, 10)}...`, ToastVariant.SUCCESS);
      }
    } catch (error) {
      console.error(error);
      toast.show('An error ocurred', ToastVariant.ERROR);
      return;
    }*/
  };

  return (
    <PageMenu>
      <Layout onCancelPayment={onCancelPayment} onSubmit={onSubmit} />
    </PageMenu>
  );
};

export default Payment;
