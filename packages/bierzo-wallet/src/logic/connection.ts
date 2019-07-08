import { BlockchainConnection } from '@iov/bcp';
import { BnsConnection } from '@iov/bns';
import { EthereumConnection } from '@iov/ethereum';
import { LiskConnection } from '@iov/lisk';
import { singleton } from 'medulas-react-components/lib/utils/singleton';

import { ChainSpec, getConfig } from '../config';

async function createEthereumConnection(url: string): Promise<BlockchainConnection> {
  return EthereumConnection.establish(url, {});
}

let getEthereumConnection = singleton<typeof createEthereumConnection>(createEthereumConnection);

async function createBnsConnection(url: string): Promise<BlockchainConnection> {
  return BnsConnection.establish(url);
}

let getBnsConnection = singleton<typeof createBnsConnection>(createBnsConnection);

async function createLiskConnection(url: string): Promise<BlockchainConnection> {
  return LiskConnection.establish(url);
}

let getLiskConnection = singleton<typeof createLiskConnection>(createLiskConnection);

export async function getConnectionFor(spec: ChainSpec): Promise<BlockchainConnection> {
  const url = spec.bootstrapNodes[0];
  if (spec.codecType === 'eth') {
    return getEthereumConnection(url);
  }

  if (spec.codecType === 'bns') {
    return getBnsConnection(url);
  }

  if (spec.codecType === 'lsk') {
    return getLiskConnection(url);
  }

  throw new Error('Chain spec not supported');
}

export async function disconnect(): Promise<void> {
  const config = getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    connection.disconnect();
  }

  // Get ready again for using them
  getEthereumConnection = singleton<typeof createEthereumConnection>(createEthereumConnection);
  getBnsConnection = singleton<typeof createBnsConnection>(createBnsConnection);
  getLiskConnection = singleton<typeof createLiskConnection>(createLiskConnection);
}
