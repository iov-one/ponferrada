import { Address, Identity, TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import { sendSignAndPostRequest } from '../../communication/signAndPost';
//import { sendSignAndPostRequest } from '../../communication/signAndPost';
import PageMenu from '../../components/PageMenu';
import { getAddressByName, isIov } from '../../logic/account';
import { RootState } from '../../store/reducers';
import { padAmount, stringToAmount } from '../../utils/balances';
import { PAYMENT_ROUTE } from '../paths';
import Layout from './components';
import { CURRENCY_FIELD, QUANTITY_FIELD } from './components/CurrencyToSend';
import { ADDRESS_FIELD } from './components/ReceiverAddress';
import { TEXTNOTE_FIELD } from './components/TextNote';

function onCancelPayment(): void {
  history.push(PAYMENT_ROUTE);
}

const Payment = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const tokens = ReactRedux.useSelector((state: RootState) => state.tokens);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const ticker = formValues[CURRENCY_FIELD] as TokenTicker;
    const amount = stringToAmount(formValues[QUANTITY_FIELD], ticker);
    const token = tokens[ticker];
    const chainId = token.chainId;
    const tokenAmount = padAmount(amount, token.token.fractionalDigits);

    let recipient: string | undefined = formValues[ADDRESS_FIELD];
    if (isIov(recipient)) {
      recipient = await getAddressByName(recipient.replace(/\*iov$/, ''), chainId);
    }

    if (!recipient) {
      toast.show('IOV username was not found', ToastVariant.ERROR);
      return;
    }

    const plainPubkey = pubKeys[chainId];
    if (!plainPubkey) {
      toast.show('Public key was not found', ToastVariant.ERROR);
      return;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));

    try {
      const transactionId = await sendSignAndPostRequest(
        chainId,
        identity,
        formValues[ADDRESS_FIELD] as Address,
        tokenAmount,
        formValues[TEXTNOTE_FIELD],
      );
      if (transactionId === null) {
        toast.show('Request rejected', ToastVariant.ERROR);
      } else {
        toast.show(`Transaction successful with ID: ${transactionId.slice(0, 10)}...`, ToastVariant.SUCCESS);
      }
    } catch (error) {
      console.error(error);
      toast.show('An error ocurred', ToastVariant.ERROR);
      return;
    }
  };

  return (
    <PageMenu>
      <Layout onCancelPayment={onCancelPayment} onSubmit={onSubmit} />
    </PageMenu>
  );
};

export default Payment;
