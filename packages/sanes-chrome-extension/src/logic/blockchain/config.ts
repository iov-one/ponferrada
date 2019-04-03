import { ChainId, TxReadCodec } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';

import { ChainConfig, ChainSpec, Config, getConfig } from '../../utils/config';
import { singleton } from '../../utils/singleton';
import {
  chainConnector,
  Codec,
  codecFromString,
  codecImplementation,
} from './connection';
import { Algorithm, algorithmForCodec, pathForCodec } from './wallet';

export interface ChainSpecWithInfo extends ChainSpec {
  readonly chainId: ChainId;
  readonly codec: Codec;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly encoder: TxReadCodec;
}

const isChainSpecWithId = (spec: ChainSpec): spec is ChainSpecWithInfo =>
  typeof (spec as ChainSpecWithInfo).chainId === 'string' &&
  typeof (spec as ChainSpecWithInfo).codec === 'string';

// fetchFullSpec will ensure the full chain info is present
const fetchFullSpec = async (
  cfg: ChainConfig<ChainSpec>
): Promise<ChainConfig<ChainSpecWithInfo>> => {
  const { chainSpec, faucetSpec } = cfg;
  if (isChainSpecWithId(chainSpec)) {
    return { chainSpec, faucetSpec };
  }
  // we get all info here...
  const codec = codecFromString(chainSpec.codecType);
  const nodes = chainSpec.bootstrapNodes;
  const connection = await chainConnector(codec, nodes).client();
  const chainId = connection.chainId();
  connection.disconnect();

  // add other info (TODO: revisit if this is best)
  const algorithm = algorithmForCodec(codec);
  const derivePath = pathForCodec(codec);
  const encoder = codecImplementation(codec);

  // now return it...
  const chainSpecWithId = {
    ...chainSpec,
    chainId,
    codec,
    algorithm,
    derivePath,
    encoder,
  };
  return { chainSpec: chainSpecWithId, faucetSpec };
};

const fetchFullConfigInfo = async (
  cfg: Config<ChainSpec>
): Promise<Config<ChainSpecWithInfo>> => {
  // const bns = await fetchFullSpec(cfg.bns);
  const chains = await Promise.all(cfg.chains.map(fetchFullSpec));
  return { chains };
  // return {bns, chains};
};

const fetchFullConfig = async (): Promise<Config<ChainSpecWithInfo>> => {
  const config = await getConfig();
  return fetchFullConfigInfo(config);
};

// getFullConfig will get the config and query the chains to determine more info
export const getFullConfig = singleton<typeof fetchFullConfig>(fetchFullConfig);
