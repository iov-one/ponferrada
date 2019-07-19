import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import PageMenu from '../../components/PageMenu';
import { RootState } from '../../store/reducers';
import { getUsername } from '../../store/usernames/selectors';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../paths';
import Layout from './components';

function onSendPayment(): void {
  history.push(PAYMENT_ROUTE);
}

function onReceivePayment(): void {
  history.push(RECEIVE_FROM_IOV_USER);
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getUsername);
  const iovAddress = bnsUsername ? `${bnsUsername.username}*iov` : undefined;

  return (
    <PageMenu>
      <Layout
        onSendPayment={onSendPayment}
        onReceivePayment={onReceivePayment}
        iovAddress={iovAddress}
        tokens={tokens}
      />
    </PageMenu>
  );
};

export default Balance;
