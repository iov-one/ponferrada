import { Identity } from '@iov/bcp';
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
      const identities = Object.values(pubKeys).map(
        (serializedIdentity): Identity => {
          return TransactionEncoder.fromJson(JSON.parse(serializedIdentity));
        },
      );

      const addressesMap: ChainAddressMap[] = [];
      for (const identity of identities) {
        addressesMap.push({
          chainId: identity.chainId,
          chainName: getChainName(identity.chainId),
          address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
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
