import { Target } from "logic/api";

export async function drinkFaucetIfNeeded(identities: readonly Target[]): Promise<void> {
  /*const config = await getConfig();
  const chainsWithFaucet = config.chains.filter(isChainConfigWithFaucet);

  // Create one job per chain that sends all available tokens. All jobs run in parallel.
  const jobs = chainsWithFaucet.map(async ({ chainSpec, faucetSpec }) => {
    const connection = getConnectionForChainId(chainSpec.chainId as ChainId);
    if (!connection) {
      return;
    }
    const codec = getCodec(chainSpec, config);
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

  await Promise.all(jobs);*/
}
