import { ChainId, Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import { getChainName } from '../../config';
import { getCodecForChainId } from '../../logic/codec';
import { RootState } from '../../store/reducers';
import { BALANCE_ROUTE } from '../paths';
import Layout, { ChainAddressMap } from './components';

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const ReceivePayment = (): JSX.Element => {
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const [chainAddressMap, setChainAddressMap] = React.useState<ChainAddressMap[]>([]);

  React.useEffect(() => {
    async function processAddresses(pubKeys: { [chain: string]: string }): Promise<void> {
      if (!pubKeys) return;
      const addressesMap: ChainAddressMap[] = [];
      const chainIds = Object.keys(pubKeys);
      for (let i = 0; i < chainIds.length; i++) {
        const chainId = chainIds[i] as ChainId;
        const plainPubkey = pubKeys[chainId];
        if (!plainPubkey) {
          return;
        }

        const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
        const address = (await getCodecForChainId(chainId)).identityToAddress(identity);
        const chainName = getChainName(chainId);
        addressesMap.push({
          chainId: chainId,
          chainName,
          address,
        });
      }
      addressesMap.sort((a: ChainAddressMap, b: ChainAddressMap) =>
        a.chainName.localeCompare(b.chainName, undefined, { sensitivity: 'base' }),
      );

      setChainAddressMap(addressesMap);
    }
    processAddresses(pubKeys);
  }, [pubKeys]);

  return <Layout chainAddressMap={chainAddressMap} onReturnToBalance={onReturnToBalance} />;
};

export default ReceivePayment;
