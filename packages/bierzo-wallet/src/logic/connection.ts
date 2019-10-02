import { BlockchainConnection, ChainId } from "@iov/bcp";
import { BnsConnection, createBnsConnector } from "@iov/bns";
import { createEthereumConnector, EthereumConnectionOptions } from "@iov/ethereum";
import { createLiskConnector } from "@iov/lisk";

import { ChainSpec, getConfig } from "../config";

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

export function isBnsSpec(spec: ChainSpec): boolean {
  return spec.codecType === "bns";
}

export function isLskSpec(spec: ChainSpec): boolean {
  return spec.codecType === "lsk";
}

export function isEthSpec(spec: ChainSpec): boolean {
  return spec.codecType === "eth";
}

export async function establishConnection(spec: ChainSpec): Promise<void> {
  if (isEthSpec(spec)) {
    return await establishEthereumConnection(spec.node, spec.chainId as ChainId, {
      scraperApiUrl: spec.scraper,
    });
  }
  if (isBnsSpec(spec)) {
    return await establishBnsConnection(spec.node, spec.chainId as ChainId);
  }
  if (isLskSpec(spec)) {
    return await establishLiskConnection(spec.node, spec.chainId as ChainId);
  }

  throw new Error("Chain spec not supported");
}

export function getActiveConnections(): readonly BlockchainConnection[] {
  return [...connections.values()];
}

export function getConnectionForChainId(chainId: ChainId): BlockchainConnection | undefined {
  return connections.get(chainId);
}

export async function getConnectionForBns(): Promise<BnsConnection> {
  const chains = (await getConfig()).chains;
  const bnsChain = chains.find(chain => isBnsSpec(chain.chainSpec));
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
