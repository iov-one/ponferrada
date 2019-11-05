import { BlockchainConnection, ChainId, Identity } from "@iov/bcp";
import { Address, TokenTicker } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { Erc20Options, Erc20TokensMap } from "@iov/ethereum";

import { ChainAddressPairWithName } from "../components/AddressesTable";
import { ConfigEthereumOptions, getChainName } from "../config";
import { ExtendedIdentity } from "../store/identities";

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
 * This method will convert Identities to ChainAddressPairWithName
 */
export function getChainAddressPairWithNames(
  identities: ReadonlyMap<ChainId, ExtendedIdentity>,
): readonly ChainAddressPairWithName[] {
  const addresses: ChainAddressPairWithName[] = [];
  for (const extendedIdentity of identities.values()) {
    addresses.push({
      address: extendedIdentity.address,
      chainId: extendedIdentity.identity.chainId,
      chainName: extendedIdentity.chainName,
    });
  }

  return addresses;
}

/**
 * This method will convert ChainAddressPair to ChainAddressPairWithName
 */
export async function chainAddressPairSortedMapping(
  addresses: readonly ChainAddressPair[],
): Promise<readonly ChainAddressPairWithName[]> {
  const chainAddresses: ChainAddressPairWithName[] = [];
  for (const address of addresses) {
    chainAddresses.push({
      ...address,
      chainName: await getChainName(address.chainId),
    });
  }
  chainAddresses.sort((a: ChainAddressPairWithName, b: ChainAddressPairWithName) =>
    a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
  );

  return chainAddresses;
}

export function getErc20TokensConfig(options: ConfigEthereumOptions): Erc20TokensMap {
  const erc20s = new Map<TokenTicker, Erc20Options>();

  options.erc20s.forEach(row => {
    const ticker = row.symbol as TokenTicker;
    const erc20Option: Erc20Options = {
      contractAddress: row.contractAddress as Address,
      symbol: row.symbol as TokenTicker,
      decimals: row.decimals,
    };
    erc20s.set(ticker, erc20Option);
  });

  return erc20s;
}
