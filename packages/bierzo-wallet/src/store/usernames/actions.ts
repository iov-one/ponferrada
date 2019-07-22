import { Identity } from '@iov/bcp';
import { bnsCodec, BnsConnection } from '@iov/bns';
import { TransactionEncoder } from '@iov/core';

import { getConfig } from '../../config';
import { getConnectionFor, isBnsSpec } from '../../logic/connection';
import { AddUsernamesActionType, BwUsername } from './reducer';

export async function getUsernames(keys: {
  [chain: string]: string;
}): Promise<{ [chainId: string]: BwUsername }> {
  const bnsChainSpec = getConfig()
    .chains.map(chain => chain.chainSpec)
    .find(isBnsSpec);
  if (!bnsChainSpec) throw new Error('Missing BNS chain spec in config');

  const bnsConnection = (await getConnectionFor(bnsChainSpec)) as BnsConnection;

  const plainPubkey = keys[bnsConnection.chainId()];
  if (!plainPubkey) return {};

  const bnsIdentity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const usernames = await bnsConnection.getUsernames({ owner: bnsAddress });
  const firstUsername = usernames.find(() => true);

  if (!firstUsername) return {};

  const out: { [chainId: string]: BwUsername } = {};
  for (const address of firstUsername.addresses) {
    out[address.chainId as string] = {
      chainId: address.chainId,
      address: address.address,
      username: firstUsername.id,
    };
  }
  return out;
}

export const addUsernamesAction = (usernames: { [chainId: string]: BwUsername }): AddUsernamesActionType => ({
  type: '@@usernames/ADD',
  payload: usernames,
});
