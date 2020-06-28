import { Address, BlockchainConnection, ChainId, Identity, TokenTicker } from "@iov/bcp";
import { BnsConnection, ChainAddressPair } from "@iov/bns";
import { Erc20Options, Erc20TokensMap } from "@iov/ethereum";

import { ChainAddressPairWithName } from "../components/AddressesTable";
import { ConfigEthereumOptions, getChainName, SupportedChain } from "../config";
import { getConnectionForChainId } from "../logic/connection";
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
  supportedChains: readonly SupportedChain[],
): readonly ChainAddressPairWithName[] {
  const addresses: ChainAddressPairWithName[] = [];

  for (const chain of supportedChains) {
    let address = "" as Address;
    const chainId = chain.chainId as ChainId;
    const identity = identities.get(chainId);
    if (identity) {
      address = identity.address;
    }

    addresses.push({
      address: address,
      chainId: chain.chainId as ChainId,
      chainName: chain.name,
    });
  }

  return addresses;
}

export function getChainAddressPairWithNamesSorted(
  identities: ReadonlyMap<ChainId, ExtendedIdentity>,
  supportedChains: readonly SupportedChain[],
): readonly ChainAddressPairWithName[] {
  const chainAddresses = getChainAddressPairWithNames(identities, supportedChains);

  return Array.from(chainAddresses).sort((a: ChainAddressPairWithName, b: ChainAddressPairWithName) =>
    a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
  );
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
      name: row.name,
    };
    erc20s.set(ticker, erc20Option);
  });

  return erc20s;
}

export function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
  for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
    if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
      return identity;
    }
  }
  return undefined;
}
