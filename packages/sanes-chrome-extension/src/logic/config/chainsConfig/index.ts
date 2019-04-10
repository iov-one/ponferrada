import { ChainId, TxReadCodec, Algorithm } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';

import { ChainConfig, FaucetSpec, fetchConfig } from './fetchConfig';
import { chainConnector, codecFromString } from '../connection';
import { algorithmForCodec, pathBuilderForCodec } from '../wallet';
import { singleton } from '../../../utils/singleton';

export interface EnhancedChainSpec {
  readonly chainId: ChainId;
  readonly bootstrapNodes: ReadonlyArray<string>;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly codec: TxReadCodec;
  readonly faucetSpec?: FaucetSpec;
}

// fetchFullSpec will ensure the full chain info is present
const enhanceChainsInfo = async (
  cfg: ChainConfig
): Promise<EnhancedChainSpec> => {
  const { chainSpec, faucetSpec } = cfg;

  // we get all info here...
  const codec = codecFromString(chainSpec.codecType);
  const nodes = chainSpec.bootstrapNodes;
  const connector = chainConnector(codec, nodes);

  const connection = await connector.client();
  const chainId = connection.chainId();
  connection.disconnect();

  // add other info (TODO: revisit if this is best)
  const algorithm = algorithmForCodec(codec);
  const derivePath = pathBuilderForCodec(codec);

  // now return it...
  const chainSpecWithId: EnhancedChainSpec = {
    bootstrapNodes: chainSpec.bootstrapNodes,
    chainId,
    algorithm,
    derivePath,
    codec: connector.codec,
    faucetSpec: faucetSpec,
  };

  return chainSpecWithId;
};

const fetchFullConfig = async (): Promise<ReadonlyArray<EnhancedChainSpec>> => {
  const config = await fetchConfig();

  const out: EnhancedChainSpec[] = [];

  for (const chain of config.chains) {
    const enhancedChain = await enhanceChainsInfo(chain);
    out.push(enhancedChain);
  }

  return out;
};

export const getConfig = singleton<typeof fetchFullConfig>(fetchFullConfig);
