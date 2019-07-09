import { Amount } from '@iov/bcp';
import React from 'react';

import { history } from '..';
import PageMenu from '../../components/PageMenu';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../paths';
import Layout from './components';

function onSendPayment(): void {
  history.push(PAYMENT_ROUTE);
}

function onReceivePayment(): void {
  history.push(RECEIVE_FROM_IOV_USER);
}

const Balance = (): JSX.Element => {
  const name = 'test';
  const tokens: ReadonlyArray<Amount> = [];
  const iovAddress = `${name}*iov`;

  const renderProps = (): JSX.Element => (
    <Layout
      onSendPayment={onSendPayment}
      onReceivePayment={onReceivePayment}
      name={iovAddress}
      tokens={tokens}
    />
  );

  return <PageMenu renderProps={renderProps} />;
};

export default Balance;
