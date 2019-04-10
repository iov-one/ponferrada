import { ChainId, TxReadCodec, Algorithm } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';

import {
  ChainConfig,
  FaucetSpec,
  getConfigurationFile,
} from './configurationfile';
import { chainConnector, codecFromString } from './connection';
import { algorithmForCodec, pathBuilderForCodec } from './wallet';
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

// fetchFullSpec will ensure the full chain info is present
async function loadChainSpec(cfg: ChainConfig): Promise<RuntimeChainSpec> {
  const { chainSpec, faucetSpec } = cfg;

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

  const out: RuntimeChainSpec[] = [];

  for (const chain of config.chains) {
    const enhancedChain = await loadChainSpec(chain);
    out.push(enhancedChain);
  }

  return { chains: out };
}

/** Requires a network connection in order to get chain IDs */
export const getRuntimeConfiguration = singleton<
  typeof loadRuntimeConfiguration
>(loadRuntimeConfiguration);
