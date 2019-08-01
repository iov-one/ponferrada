import { Identity, TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { IovFaucet } from '@iov/faucets';

import { getConfig, isChainConfigWithFaucet } from '../config';
import { filterExistingTokens } from '../utils/tokens';
import { getCodec } from './codec';
import { getConnectionFor } from './connection';

export async function drinkFaucetIfNeeded(keys: { [chain: string]: string }): Promise<void> {
  const chainsWithFaucet = getConfig().chains.filter(isChainConfigWithFaucet);

  // Create one job per chain that sends all available tokens. All jobs run in parallel.
  const jobs = chainsWithFaucet.map(async ({ chainSpec, faucetSpec }) => {
    const codec = getCodec(chainSpec);
    const connection = await getConnectionFor(chainSpec);
    const chainId = connection.chainId() as string;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) return;

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));

    // Skip balance tokens
    const tokensByChainId = await filterExistingTokens(connection, identity, faucetSpec.tokens);

    const faucet = new IovFaucet(faucetSpec.uri);
    const address = codec.identityToAddress(identity);

    for (const token of tokensByChainId) {
      try {
        await faucet.credit(address, token as TokenTicker);
      } catch (err) {
        console.error(`Error using faucet for ${chainId}: ${err.message}`);
      }
    }
  });

  await Promise.all(jobs);
}
