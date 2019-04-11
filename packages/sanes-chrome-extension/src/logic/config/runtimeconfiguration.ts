import { ChainId, TxReadCodec, Algorithm, ChainConnector } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';
import { bnsConnector } from '@iov/bns';
import { liskConnector } from '@iov/lisk';
import { ethereumConnector } from '@iov/ethereum';

import {
  algorithmForCodec,
  ChainConfig,
  codecTypeFromString,
  CodecType,
  FaucetSpec,
  getConfigurationFile,
  pathBuilderForCodec,
} from '.';
import { singleton } from '../../utils/singleton';

export interface RuntimeChainSpec {
  readonly chainId: ChainId;
  readonly bootstrapNodes: ReadonlyArray<string>;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly codecType: CodecType;
  readonly codec: TxReadCodec;
  readonly faucetSpec?: FaucetSpec;
}

export interface RuntimeConfiguration {
  readonly chains: ReadonlyArray<RuntimeChainSpec>;
}

export function chainConnector(
  codec: CodecType,
  nodes: ReadonlyArray<string>
): ChainConnector {
  const url = nodes[0];
  switch (codec) {
    case CodecType.Bns:
      return bnsConnector(url);
    case CodecType.Lisk:
      return liskConnector(url);
    case CodecType.Ethereum:
      const scraperApiUrl = nodes[1];
      return ethereumConnector(url, { scraperApiUrl });
    default:
      throw new Error('No connector for this codec found');
  }
}

async function loadChainSpec(fromFile: ChainConfig): Promise<RuntimeChainSpec> {
  const { chainSpec, faucetSpec } = fromFile;

  const codecType = codecTypeFromString(chainSpec.codecType);
  const algorithm = algorithmForCodec(codecType);
  const derivePath = pathBuilderForCodec(codecType);
  const connector = chainConnector(codecType, chainSpec.bootstrapNodes);

  const connection = await connector.client();
  const chainId = connection.chainId();
  connection.disconnect();

  const out: RuntimeChainSpec = {
    bootstrapNodes: chainSpec.bootstrapNodes,
    chainId,
    algorithm,
    derivePath,
    codecType: codecType,
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
