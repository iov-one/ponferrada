import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { IovFaucet } from '@iov/faucets';

import { getConfig } from '../config';
import { getConnectionFor } from './connection';

export async function drinkFaucetIfNeeded(keys: { [chain: string]: string }): Promise<void> {
  const config = getConfig();
  const chains = config.chains;

  let faucetCredits: ReadonlyArray<Promise<void>> = [];
  for (const chain of chains) {
    const faucetSpec = chain.faucetSpec;
    if (!faucetSpec) {
      continue;
    }

    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId() as string;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
    const account = await connection.getAccount({ pubkey: identity.pubkey });
    if (!account) {
      continue;
    }

    for (const balance of account.balance) {
      const faucet = new IovFaucet(faucetSpec.uri);
      faucetCredits = [...faucetCredits, faucet.credit(account.address, balance.tokenTicker)];
    }
  }

  await Promise.all(faucetCredits);
}
