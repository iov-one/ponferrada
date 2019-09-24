import { BlockchainConnection, ChainId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { EthereumConnection } from "@iov/ethereum";
import { LiskConnection } from "@iov/lisk";

import { ChainSpec, getConfig } from "../config";

let ethereumConnection: EthereumConnection | undefined;
let bnsConnection: BnsConnection | undefined;
let liskConnection: LiskConnection | undefined;

async function getEthereumConnection(url: string, scraperApiUrl?: string): Promise<EthereumConnection> {
  if (!ethereumConnection) {
    // eslint-disable-next-line require-atomic-updates
    ethereumConnection = await EthereumConnection.establish(url, { scraperApiUrl });
  }
  return ethereumConnection;
}

async function getBnsConnection(url: string): Promise<BnsConnection> {
  if (!bnsConnection) {
    // eslint-disable-next-line require-atomic-updates
    bnsConnection = await BnsConnection.establish(url);
  }
  return bnsConnection;
}

async function getLiskConnection(url: string): Promise<LiskConnection> {
  if (!liskConnection) {
    // eslint-disable-next-line require-atomic-updates
    liskConnection = await LiskConnection.establish(url);
  }
  return liskConnection;
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

export async function getConnectionFor(spec: ChainSpec): Promise<BlockchainConnection> {
  if (isEthSpec(spec)) return getEthereumConnection(spec.node, spec.scraper);
  if (isBnsSpec(spec)) return getBnsConnection(spec.node);
  if (isLskSpec(spec)) return getLiskConnection(spec.node);

  throw new Error("Chain spec not supported");
}

export async function getConnectionForChainId(chainId: ChainId): Promise<BlockchainConnection> {
  for (const chain of (await getConfig()).chains) {
    if (chain.chainSpec.chainId === chainId) {
      return await getConnectionFor(chain.chainSpec);
    }
  }
  throw new Error("No connection found for this chainId");
}

export async function getConnectionForBns(): Promise<BnsConnection> {
  for (const chain of (await getConfig()).chains) {
    if (isBnsSpec(chain.chainSpec)) {
      return (await getConnectionFor(chain.chainSpec)) as BnsConnection;
    }
  }
  throw new Error("No connection found for this chainId");
}

/**
 * Disconnects all blockchain connections. Calling getConnectionFor after
 * this will establich a new connection.
 */
export function disconnect(): void {
  if (bnsConnection) bnsConnection.disconnect();
  if (ethereumConnection) ethereumConnection.disconnect();
  if (liskConnection) liskConnection.disconnect();

  bnsConnection = undefined;
  ethereumConnection = undefined;
  liskConnection = undefined;
}
