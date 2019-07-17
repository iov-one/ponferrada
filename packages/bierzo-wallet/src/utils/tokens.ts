import { BlockchainConnection, Identity } from '@iov/bcp';

// exported for testing purposes
export async function filterExistingTokens(
  connection: BlockchainConnection,
  identity: Identity,
  tokensByChainId: ReadonlyArray<string>,
): Promise<ReadonlyArray<string>> {
  const account = await connection.getAccount({ pubkey: identity.pubkey });
  if (!account) {
    return tokensByChainId;
  }

  for (const balance of account.balance) {
    tokensByChainId = tokensByChainId.filter(ticker => ticker !== balance.tokenTicker);
  }

  return tokensByChainId;
}
