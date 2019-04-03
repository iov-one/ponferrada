import { ChainId } from '@iov/bcp';

import { ChainConfig, ChainSpec, Config, getConfig } from '../../utils/config';
import { singleton } from '../../utils/singleton';
import { Codec, codecFromString, chainConnector } from './connection';

export interface ChainSpecWithInfo extends ChainSpec {
  readonly chainId: ChainId;
  readonly codec: Codec;
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

  // now return it...
  const chainSpecWithId = { ...chainSpec, chainId, codec };
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
