import { BlockchainConnection, ChainId } from "@iov/bcp";
import { BnsConnection, createBnsConnector } from "@iov/bns";
import { createEthereumConnector, EthereumConnectionOptions } from "@iov/ethereum";
import { createLiskConnector } from "@iov/lisk";

import { ChainSpec, getConfig } from "../config";

export interface ChainConnections {
  [chainId: string]: BlockchainConnection;
}

const connections: ChainConnections = {};

export async function setEthereumConnection(
  url: string,
  chainId: ChainId,
  options: EthereumConnectionOptions,
): Promise<void> {
  if (!connections[chainId]) {
    const connector = createEthereumConnector(url, options, chainId);
    // eslint-disable-next-line require-atomic-updates
    connections[chainId] = await connector.establishConnection();
  }
}

export async function setBnsConnection(url: string, chainId: ChainId): Promise<void> {
  if (!connections[chainId]) {
    const connector = createBnsConnector(url, chainId);
    // eslint-disable-next-line require-atomic-updates
    connections[chainId] = await connector.establishConnection();
  }
}

export async function setLiskConnection(url: string, chainId: ChainId): Promise<void> {
  if (!connections[chainId]) {
    const connector = createLiskConnector(url, chainId);
    // eslint-disable-next-line require-atomic-updates
    connections[chainId] = await connector.establishConnection();
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
    return await setEthereumConnection(spec.node, spec.chainId as ChainId, { scraperApiUrl: spec.scraper });
  }
  if (isBnsSpec(spec)) {
    return await setBnsConnection(spec.node, spec.chainId as ChainId);
  }
  if (isLskSpec(spec)) {
    return await setLiskConnection(spec.node, spec.chainId as ChainId);
  }

  throw new Error("Chain spec not supported");
}

export function getActiveConnections(): BlockchainConnection[] {
  return Object.values(connections);
}

export function hasActiveConnection(chainId: ChainId): boolean {
  return chainId in connections;
}

export function getConnectionForChainId(chainId: ChainId): BlockchainConnection {
  if (connections[chainId]) {
    return connections[chainId];
  }
  throw new Error(`No connection found for ${chainId} chainId`);
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
  for (const chainId in connections) {
    connections[chainId].disconnect();
  }

  Object.keys(connections).forEach(function(chainId) {
    delete connections[chainId];
  });
}
