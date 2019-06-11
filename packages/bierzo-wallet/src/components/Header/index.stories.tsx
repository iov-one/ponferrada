import { TokenTicker } from '@iov/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReadonlyDate } from 'readonly-date';
import { DeepPartial } from 'redux';
import Block from '~/components/layout/Block';
import Hairline from '~/components/layout/Hairline';
import Typography from '~/components/layout/Typography';
import { stringToAmount } from '~/logic';
import { RootState } from '~/reducers';
import { ProcessedTx, Tx } from '~/store/notifications/state';
import { RootMatchMedia } from '~/utils/storybook';
import Header from './index';

const Separator = () => (
  <Block margin="xl">
    <Hairline />
  </Block>
);

const pendingTxs: ReadonlyArray<Tx> = [
  {
    id: 'tx1',
    recipient: 'alex*iov',
    amount: stringToAmount('12.5', 'IOV' as TokenTicker),
    signer: 'adolfo*iov',
  },
  {
    id: 'tx2',
    recipient: 'moe*iov',
    amount: stringToAmount('0.14', 'IOV' as TokenTicker),
    signer: 'adolfo*iov',
  },
];

const txs: ReadonlyArray<ProcessedTx> = [
  {
    received: true,
    signer: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx1',
  },
  {
    received: false,
    signer: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx2',
  },
];

const faultTx: ProcessedTx = {
  received: false,
  signer: 'me',
  recipient: 'alex*iov',
  amount: stringToAmount('100.5', 'IOV' as TokenTicker),
  time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
  success: false,
  id: 'tx3',
};

const txStore: DeepPartial<RootState> = {
  notification: {
    transaction: txs,
  },
};

const pendingTxStore: DeepPartial<RootState> = {
  notification: {
    pending: pendingTxs,
  },
};

const fullStore = (faulty: boolean): DeepPartial<RootState> => {
  const fullTxs = faulty ? [faultTx, ...txs] : txs;

  return {
    notification: {
      pending: pendingTxs,
      transaction: fullTxs,
    },
  };
};

interface EnahncedHeaderProps {
  readonly match: boolean;
  readonly storeProps?: DeepPartial<RootState>;
  readonly text: string;
}

const EnhancedHeader = ({ match, storeProps, text }: EnahncedHeaderProps) => (
  <React.Fragment>
    <Typography variant="h5">{text}</Typography>
    <RootMatchMedia matchMedia={match} storeProps={storeProps}>
      <Header />
    </RootMatchMedia>
    <Separator />
  </React.Fragment>
);

storiesOf('Components /header', module)
  .add('Header for desktop', () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <EnhancedHeader match={false} storeProps={fullStore(false)} text="Full Header" />
      <EnhancedHeader match={false} storeProps={fullStore(true)} text="Faulty full Header" />
      <EnhancedHeader match={false} storeProps={txStore} text="Txs Header" />
      <EnhancedHeader match={false} storeProps={pendingTxStore} text="Pending Header" />
      <EnhancedHeader match={false} text="Empty Header" />
    </div>
  ))
  .add('Header for phones', () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: '425px' }}>
      <EnhancedHeader match storeProps={fullStore(true)} text="Full Header" />
      <EnhancedHeader match storeProps={fullStore(false)} text="Faultyfull Header" />
      <EnhancedHeader match storeProps={txStore} text="Txs Header" />
      <EnhancedHeader match storeProps={pendingTxStore} text="Pending Header" />
      <EnhancedHeader match text="Empty Header" />
    </div>
  ));
