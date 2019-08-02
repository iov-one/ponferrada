import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import { getChainName } from '../../config';
import { getCodecForChainId } from '../../logic/codec';
import { RootState } from '../../store/reducers';
import { BwToken } from '../../store/tokens';
import { BALANCE_ROUTE } from '../paths';
import Layout, { ChainAddressMap } from './components';

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const ReceivePayment = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.tokens);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const [chainAddressMap, setChainAddressMap] = React.useState<ChainAddressMap[]>([]);

  React.useEffect(() => {
    async function processAddresses(
      tokens: { [key: string]: BwToken },
      pubKeys: { [chain: string]: string },
    ): Promise<void> {
      const addressesMap: ChainAddressMap[] = [];
      const tokensValues = Object.values(tokens);
      for (let i = 0; i < tokensValues.length; i++) {
        const token = tokensValues[i];
        const plainPubkey = pubKeys[token.chainId];
        if (!plainPubkey) {
          return;
        }

        const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
        const address = (await getCodecForChainId(token.chainId)).identityToAddress(identity);
        const chainName = getChainName(token.chainId);
        addressesMap.push({
          chainId: token.chainId,
          chainName,
          address,
        });
      }

      setChainAddressMap(addressesMap);
    }
    processAddresses(tokens, pubKeys);
  }, [tokens, pubKeys]);

  return <Layout chainAddressMap={chainAddressMap} onReturnToBalance={onReturnToBalance} />;
};

export default ReceivePayment;
