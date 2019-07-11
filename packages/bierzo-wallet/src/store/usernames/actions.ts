import { PublicIdentity } from '@iov/bcp';
import { BnsConnection } from '@iov/bns';
import { TransactionEncoder } from '@iov/core';

import { getConfig } from '../../config';
import { getConnectionFor, isBnsConnection } from '../../logic/connection';
import { AddUsernamesActionType, BwUsername } from './reducer';

export async function getUsernames(keys: {
  [chain: string]: string;
}): Promise<{ [chainId: string]: BwUsername }> {
  const config = getConfig();
  const usernames: { [chainId: string]: BwUsername } = {};
  const chains = config.chains;

  for (const chain of chains) {
    if (!isBnsConnection(chain.chainSpec)) {
      continue;
    }

    const connection = (await getConnectionFor(chain.chainSpec)) as BnsConnection;
    const chainId = connection.chainId();

    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      break;
    }

    const pubIdentity: PublicIdentity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
    const account = await connection.getAccount({ pubkey: pubIdentity.pubkey });
    if (!account) {
      break;
    }

    const names = await connection.getUsernames({ owner: account.address });
    const hasName = names.length > 0;
    if (!hasName) {
      break;
    }

    const name = names[0];

    for (const address of name.addresses) {
      usernames[address.chainId as string] = {
        chainId: address.chainId,
        address: address.address,
        username: name.id,
      };
    }
  }

  return usernames;
}

export const addUsernamesAction = (usernames: { [chainId: string]: BwUsername }): AddUsernamesActionType => ({
  type: '@@usernames/ADD',
  payload: usernames,
});
