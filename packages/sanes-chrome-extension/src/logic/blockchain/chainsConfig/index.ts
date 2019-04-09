import { ChainId, TxReadCodec, Algorithm } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';

import { ChainConfig, ChainSpec, Config, fetchConfig } from './fetchConfig';
import { chainConnector, codecFromString } from '../connection';
import { algorithmForCodec, pathForCodec } from '../wallet';
import { singleton } from '../../../utils/singleton';

export interface EnhancedChainSpec extends ChainSpec {
  readonly chainId: ChainId;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly encoder: TxReadCodec;
}

const alreadyEnhanced = (spec: ChainSpec): spec is EnhancedChainSpec =>
  typeof (spec as EnhancedChainSpec).chainId === 'string';

// fetchFullSpec will ensure the full chain info is present
const enhanceChainsInfo = async (
  cfg: ChainConfig<ChainSpec>
): Promise<ChainConfig<EnhancedChainSpec>> => {
  const { chainSpec, faucetSpec } = cfg;
  if (alreadyEnhanced(chainSpec)) {
    return { chainSpec, faucetSpec };
  }
  // we get all info here...
  const codec = codecFromString(chainSpec.codecType);
  const nodes = chainSpec.bootstrapNodes;
  const connector = chainConnector(codec, nodes);

  const connection = await connector.client();
  const chainId = connection.chainId();
  connection.disconnect();

  // add other info (TODO: revisit if this is best)
  const algorithm = algorithmForCodec(codec);
  const derivePath = pathForCodec(codec);

  // now return it...
  const chainSpecWithId = {
    ...chainSpec,
    chainId,
    algorithm,
    derivePath,
    encoder: connector.codec,
  };

  return { chainSpec: chainSpecWithId, faucetSpec };
};

const fetchFullConfig = async (): Promise<Config<EnhancedChainSpec>> => {
  const config = await fetchConfig();
  let enhancedConfig = {
    chains: new Array<ChainConfig<EnhancedChainSpec>>(), // eslint-disable-line
  };

  for (const chain of config.chains) {
    const enhancedChain = await enhanceChainsInfo(chain);
    enhancedConfig.chains.push(enhancedChain);
  }

  return enhancedConfig;
};

export const getConfig = singleton<typeof fetchFullConfig>(fetchFullConfig);
