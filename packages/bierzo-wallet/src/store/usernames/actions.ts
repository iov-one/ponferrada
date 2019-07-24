import { Identity } from '@iov/bcp';
import { bnsCodec, BnsConnection } from '@iov/bns';
import { TransactionEncoder } from '@iov/encoding';

import { getConfig } from '../../config';
import { getConnectionFor, isBnsSpec } from '../../logic/connection';
import { AddUsernamesActionType, BwUsername } from './reducer';

export async function getUsernames(keys: { [chain: string]: string }): Promise<readonly BwUsername[]> {
  const bnsChainSpec = getConfig()
    .chains.map(chain => chain.chainSpec)
    .find(isBnsSpec);
  if (!bnsChainSpec) throw new Error('Missing BNS chain spec in config');

  const bnsConnection = (await getConnectionFor(bnsChainSpec)) as BnsConnection;

  const plainPubkey = keys[bnsConnection.chainId()];
  if (!plainPubkey) return [];

  const bnsIdentity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const usernames = await bnsConnection.getUsernames({ owner: bnsAddress });

  return usernames.map(username => ({
    username: username.id,
    addresses: username.targets,
  }));
}

export const addUsernamesAction = (usernames: readonly BwUsername[]): AddUsernamesActionType => ({
  type: '@@usernames/ADD',
  payload: usernames,
});
