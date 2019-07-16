import { BlockchainConnection } from '@iov/bcp';
import { BnsConnection } from '@iov/bns';
import { EthereumConnection } from '@iov/ethereum';
import { LiskConnection } from '@iov/lisk';

import { ChainSpec } from '../config';

let ethereumConnection: EthereumConnection | undefined;
let bnsConnection: BnsConnection | undefined;
let liskConnection: LiskConnection | undefined;

async function getEthereumConnection(url: string): Promise<EthereumConnection> {
  if (!ethereumConnection) {
    ethereumConnection = await EthereumConnection.establish(url, {});
  }
  return ethereumConnection;
}

async function getBnsConnection(url: string): Promise<BnsConnection> {
  if (!bnsConnection) {
    bnsConnection = await BnsConnection.establish(url);
  }
  return bnsConnection;
}

async function getLiskConnection(url: string): Promise<LiskConnection> {
  if (!liskConnection) {
    liskConnection = await LiskConnection.establish(url);
  }
  return liskConnection;
}

export function isBnsSpec(spec: ChainSpec): boolean {
  return spec.codecType === 'bns';
}

export function isLskSpec(spec: ChainSpec): boolean {
  return spec.codecType === 'lsk';
}

export function isEthSpec(spec: ChainSpec): boolean {
  return spec.codecType === 'eth';
}

export async function getConnectionFor(spec: ChainSpec): Promise<BlockchainConnection> {
  if (spec.codecType === 'eth') {
    return getEthereumConnection(spec.node);
  }

  if (isBnsSpec(spec)) {
    return getBnsConnection(spec.node);
  }

  if (spec.codecType === 'lsk') {
    return getLiskConnection(spec.node);
  }

  throw new Error('Chain spec not supported');
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
