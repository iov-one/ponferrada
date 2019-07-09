import { Amount, TokenTicker } from '@iov/bcp';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import PageMenu from '~/components/pages/PageMenu';
import { RootMatchMedia } from '~/utils/storybook';
import Layout from './index';

const TOKENS: ReadonlyArray<Amount> = [
  {
    quantity: '82500',
    fractionalDigits: 4,
    tokenTicker: 'IOV' as TokenTicker,
  },
  {
    quantity: '1226775',
    fractionalDigits: 5,
    tokenTicker: 'ETH' as TokenTicker,
  },
];

const NO_TOKENS: ReadonlyArray<Amount> = [];

const ACCOUNT_NAME = 'adolfo*iov';

const renderProps = (tokens: ReadonlyArray<Amount>) => (phone: boolean) => (
  <Layout
    name={ACCOUNT_NAME}
    tokens={tokens}
    phone={phone}
    onReceivePayment={() => true}
    onSendPayment={() => true}
  />
);

storiesOf('Routes /balance', module)
  .add('Balance view for desktop', () => (
    <RootMatchMedia matchMedia={false}>
      <PageMenu phoneFullWidth renderProps={renderProps(TOKENS)} />
    </RootMatchMedia>
  ))
  .add('Balance view without currencies', () => (
    <RootMatchMedia matchMedia={false}>
      <PageMenu phoneFullWidth renderProps={renderProps(NO_TOKENS)} />
    </RootMatchMedia>
  ))
  .add('Balance view for phones', () => (
    <RootMatchMedia matchMedia={true}>
      <div style={{ maxWidth: '360px' }}>
        <PageMenu phoneFullWidth renderProps={renderProps(TOKENS)} />
      </div>
    </RootMatchMedia>
  ));
