import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { history } from '..';
import { getChainName } from '../../config';
import { getCodecForChainId } from '../../logic/codec';
import { RootState } from '../../store/reducers';
import { BALANCE_ROUTE } from '../paths';
import Layout, { ChainAddress } from './components';

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const ReceivePayment = (): JSX.Element => {
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const [chainAddresses, setChainAddresses] = React.useState<ReadonlyArray<ChainAddress>>([]);

  React.useEffect(() => {
    async function processAddresses(pubKeys: { [chain: string]: string }): Promise<void> {
      const identities = Object.values(pubKeys).map(
        (serializedIdentity): Identity => {
          return TransactionEncoder.fromJson(JSON.parse(serializedIdentity));
        },
      );

      const addresses: ChainAddress[] = [];
      for (const identity of identities) {
        addresses.push({
          chainId: identity.chainId,
          chainName: getChainName(identity.chainId),
          address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
        });
      }
      addresses.sort((a: ChainAddress, b: ChainAddress) =>
        a.chainName.localeCompare(b.chainName, undefined, { sensitivity: 'base' }),
      );

      setChainAddresses(addresses);
    }
    processAddresses(pubKeys);
  }, [pubKeys]);

  return <Layout chainAddresses={chainAddresses} onReturnToBalance={onReturnToBalance} />;
};

export default ReceivePayment;
