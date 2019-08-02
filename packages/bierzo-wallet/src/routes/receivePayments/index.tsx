import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import { getChainName } from '../../config';
import { getCodecForChainId } from '../../logic/codec';
import { RootState } from '../../store/reducers';
import { PAYMENT_ROUTE } from '../paths';
import Layout from './components';

function onReturnToPayment(): void {
  history.push(PAYMENT_ROUTE);
}

const Payment = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.tokens);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const chainAddressMap = React.useMemo(
    () =>
      Object.values(tokens).map(async token => {
        const plainPubkey = pubKeys[token.chainId];
        if (!plainPubkey) {
          return;
        }

        const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
        const address = (await getCodecForChainId(token.chainId)).identityToAddress(identity);
        const chainName = getChainName(token.chainId);
        return {
          chainId: token.chainId,
          chainName,
          address,
        };
      }),
    [tokens, pubKeys],
  );

  return <Layout chainAddressMap={chainAddressMap} onReturnToPayment={onReturnToPayment} />;
};

export default Payment;
