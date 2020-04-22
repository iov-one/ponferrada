import { BlockchainConnection, ChainId } from "@iov/bcp";
import { BnsConnection, createBnsConnector } from "@iov/bns";
import { createEthereumConnector, EthereumConnectionOptions } from "@iov/ethereum";
import { createLiskConnector } from "@iov/lisk";

import { ChainSpec, CodecType, getConfig } from "../config";
import { getErc20TokensConfig } from "../utils/tokens";

const connections = new Map<ChainId, BlockchainConnection>();

async function establishEthereumConnection(
  url: string,
  chainId: ChainId,
  options: EthereumConnectionOptions,
): Promise<void> {
  if (!connections.has(chainId)) {
    const connector = createEthereumConnector(url, options, chainId);
    connections.set(chainId, await connector.establishConnection());
  }
}

async function establishBnsConnection(url: string, chainId: ChainId): Promise<void> {
  if (!connections.has(chainId)) {
    const connector = createBnsConnector(url, chainId);
    connections.set(chainId, await connector.establishConnection());
  }
}

async function establishLiskConnection(url: string, chainId: ChainId): Promise<void> {
  if (!connections.has(chainId)) {
    const connector = createLiskConnector(url, chainId);
    connections.set(chainId, await connector.establishConnection());
  }
}

export async function establishConnection(spec: ChainSpec): Promise<void> {
  switch (spec.codecType) {
    case CodecType.Bns:
      return await establishBnsConnection(spec.node, spec.chainId as ChainId);
    case CodecType.Ethereum:
      return await establishEthereumConnection(spec.node, spec.chainId as ChainId, {
        scraperApiUrl: spec.scraper,
        erc20Tokens: spec.ethereumOptions ? getErc20TokensConfig(spec.ethereumOptions) : undefined,
      });
    case CodecType.Iovns:
      return undefined;
    case CodecType.Lisk:
      return await establishLiskConnection(spec.node, spec.chainId as ChainId);
    default:
      throw new Error("Chain spec not supported");
  }
}

export function getActiveConnections(): readonly BlockchainConnection[] {
  return [...connections.values()];
}

export function getConnectionForChainId(chainId: ChainId): BlockchainConnection | undefined {
  return connections.get(chainId);
}

export async function getConnectionForBns(): Promise<BnsConnection> {
  const chains = (await getConfig()).chains;
  const bnsChain = chains.find(chain => chain.chainSpec.codecType === CodecType.Bns);
  if (bnsChain) {
    return getConnectionForChainId(bnsChain.chainSpec.chainId as ChainId) as BnsConnection;
  }

  throw new Error("No connection found for BNS chain");
}

/**
 * Disconnects all blockchain connections. Calling establishConnection after
 * this will establich a new connection.
 */
export function disconnect(): void {
  connections.forEach(connection => {
    connection.disconnect();
  });

  connections.clear();
}
