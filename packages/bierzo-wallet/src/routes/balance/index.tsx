import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import PageMenu from '../../components/PageMenu';
import { RootState } from '../../store/reducers';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../paths';
import Layout from './components';

function onSendPayment(): void {
  history.push(PAYMENT_ROUTE);
}

function onReceivePayment(): void {
  history.push(RECEIVE_FROM_IOV_USER);
}

const Balance = (): JSX.Element => {
  const balance = ReactRedux.useSelector((state: RootState) => state.balances);
  const name = 'test';
  const iovAddress = `${name}*iov`;

  return (
    <PageMenu>
      <Layout
        onSendPayment={onSendPayment}
        onReceivePayment={onReceivePayment}
        name={iovAddress}
        balance={balance}
      />
    </PageMenu>
  );
};

export default Balance;
