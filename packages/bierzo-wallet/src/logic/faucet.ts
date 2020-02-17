import { ChainId, Identity, TokenTicker } from "@iov/bcp";
import { IovFaucet } from "@iov/faucets";

import { getConfig, isChainConfigWithFaucet } from "../config";
import { filterExistingTokens } from "../utils/tokens";
import { getCodec } from "./codec";
import { getConnectionForChainId } from "./connection";

export async function drinkFaucetIfNeeded(identities: readonly Identity[]): Promise<void> {
  const chainsWithFaucet = (await getConfig()).chains.filter(isChainConfigWithFaucet);

  // Create one job per chain that sends all available tokens. All jobs run in parallel.
  const jobs = chainsWithFaucet.map(async ({ chainSpec, faucetSpec }) => {
    const connection = getConnectionForChainId(chainSpec.chainId as ChainId);
    if (!connection) {
      return;
    }
    const codec = getCodec(chainSpec);
    const chainId = connection.chainId;
    const identity = identities.find(identity => identity.chainId === chainId);
    if (!identity) {
      return;
    }

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
