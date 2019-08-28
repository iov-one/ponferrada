import { BlockchainConnection, Identity } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";

import { ChainAddress } from "../components/AddressesTable";
import { getChainName } from "../config";
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

  let tokensNotOwnedByUser: readonly string[] = tokensByChainId;
  for (const balance of account.balance) {
    tokensNotOwnedByUser = tokensNotOwnedByUser.filter(ticker => ticker !== balance.tokenTicker);
  }
  return tokensNotOwnedByUser;
}

/**
 * This method will convert Identities to ChainAddressPair
 */
export async function getChainAddressPair(identities: {
  [chain: string]: Identity;
}): Promise<ChainAddressPair[]> {
  const addresses: ChainAddressPair[] = [];
  for (const identity of Object.values(identities)) {
    addresses.push({
      chainId: identity.chainId,
      address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
    });
  }

  return addresses;
}

/**
 * This method will convert ChainAddressPair to ChainAddress
 */
export async function chainAddressPairSortedMapping(
  addresses: readonly ChainAddressPair[],
): Promise<readonly ChainAddress[]> {
  const chainAddresses: ChainAddress[] = [];
  for (const address of addresses) {
    chainAddresses.push({
      ...address,
      chainName: await getChainName(address.chainId),
    });
  }
  chainAddresses.sort((a: ChainAddress, b: ChainAddress) =>
    a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
  );

  return chainAddresses;
}
