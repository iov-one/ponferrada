import { BlockchainConnection, Identity } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";

import { getCodecForChainId } from "../logic/codec";

// exported for testing purposes
export async function filterExistingTokens(
  connection: BlockchainConnection,
  identity: Identity,
  tokensByChainId: readonly string[],
): Promise<readonly string[]> {
  const account = await connection.getAccount({ pubkey: identity.pubkey });
  if (!account) {
    return tokensByChainId;
  }

  for (const balance of account.balance) {
    tokensByChainId = tokensByChainId.filter(ticker => ticker !== balance.tokenTicker);
  }

  return tokensByChainId;
}

/**
 * This method will convert pubKeys to ChainAddressPair
 */
export async function getChainAddressPair(pubKeys: { [chain: string]: string }): Promise<ChainAddressPair[]> {
  const addresses: ChainAddressPair[] = [];
  for (const key of Object.values(pubKeys)) {
    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(key));

    addresses.push({
      chainId: identity.chainId,
      address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
    });
  }

  return addresses;
}
