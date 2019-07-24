import { Identity, TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { IovFaucet } from '@iov/faucets';

import { getConfig } from '../config';
import { filterExistingTokens } from '../utils/tokens';
import { getCodec } from './codec';
import { getConnectionFor } from './connection';

export async function drinkFaucetIfNeeded(keys: { [chain: string]: string }): Promise<void> {
  const config = getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    const faucetSpec = chain.faucetSpec;
    if (!faucetSpec) {
      continue;
    }

    const codec = getCodec(chain.chainSpec);
    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId() as string;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));

    // Skip balance tokens
    const tokensByChainId = await filterExistingTokens(connection, identity, faucetSpec.tokens);

    const faucet = new IovFaucet(faucetSpec.uri);
    const address = codec.identityToAddress(identity);

    for (const token of tokensByChainId) {
      try {
        await faucet.credit(address, token as TokenTicker);
      } catch (err) {
        console.log(`Error using faucet for ${chainId}: ${err.message}`);
      }
    }
  }
}
