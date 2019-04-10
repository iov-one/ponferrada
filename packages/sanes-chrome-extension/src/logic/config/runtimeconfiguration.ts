import { ChainId, TxReadCodec, Algorithm, ChainConnector } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';
import { bnsConnector } from '@iov/bns';
import { liskConnector } from '@iov/lisk';
import { ethereumConnector } from '@iov/ethereum';

import {
  ChainConfig,
  FaucetSpec,
  getConfigurationFile,
} from './configurationfile';
import { codecFromString, Codec } from './codec';
import { algorithmForCodec, pathBuilderForCodec } from './codec';
import { singleton } from '../../utils/singleton';

export interface RuntimeChainSpec {
  readonly chainId: ChainId;
  readonly bootstrapNodes: ReadonlyArray<string>;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly codec: TxReadCodec;
  readonly faucetSpec?: FaucetSpec;
}

export interface RuntimeConfiguration {
  readonly chains: ReadonlyArray<RuntimeChainSpec>;
}

export function chainConnector(
  codec: Codec,
  nodes: ReadonlyArray<string>
): ChainConnector {
  const url = nodes[0];
  switch (codec) {
    case Codec.Bns:
      return bnsConnector(url);
    case Codec.Lisk:
      return liskConnector(url);
    case Codec.Ethereum:
      const scraperApiUrl = nodes[1];
      return ethereumConnector(url, { scraperApiUrl });
    default:
      throw new Error('No connector for this codec found');
  }
}

async function loadChainSpec(fromFile: ChainConfig): Promise<RuntimeChainSpec> {
  const { chainSpec, faucetSpec } = fromFile;

  const codec = codecFromString(chainSpec.codecType);
  const algorithm = algorithmForCodec(codec);
  const derivePath = pathBuilderForCodec(codec);
  const connector = chainConnector(codec, chainSpec.bootstrapNodes);

  const connection = await connector.client();
  const chainId = connection.chainId();
  connection.disconnect();

  const out: RuntimeChainSpec = {
    bootstrapNodes: chainSpec.bootstrapNodes,
    chainId,
    algorithm,
    derivePath,
    codec: connector.codec,
    faucetSpec: faucetSpec,
  };
  return out;
}

async function loadRuntimeConfiguration(): Promise<RuntimeConfiguration> {
  const config = await getConfigurationFile();
  const runtimeChains = await Promise.all(config.chains.map(loadChainSpec));
  return { chains: runtimeChains };
}

/** Requires a network connection in order to get chain IDs */
export const getRuntimeConfiguration = singleton<
  typeof loadRuntimeConfiguration
>(loadRuntimeConfiguration);
