import { TokenTicker } from '@iov/bcp';
import { singleton } from 'medulas-react-components/lib/utils/singleton';

import development from './development.json';
import production from './production.json';
// import staging from './staging';

export interface Config {
  readonly chains: ReadonlyArray<ChainConfig>;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

export interface ConfigErc20Options {
  readonly contractAddress: string;
  readonly symbol: string;
  readonly decimals: number;
}

export interface ChainSpec {
  readonly codecType: string;
  readonly bootstrapNodes: ReadonlyArray<string>;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly token: TokenTicker;
}

const configuration = (): Config => {
  if (process.env.NODE_ENV === 'test') {
    return (development as unknown) as Config;
  }

  if (process.env.NODE_ENV === 'production') {
    return (production as unknown) as Config;
  }

  if (process.env.NODE_ENV === 'development') {
    return (development as unknown) as Config;
  }

  throw new Error('Unexpected NODE_ENV variable for obtaining configuration');
};

export const getConfig = singleton<typeof configuration>(configuration);
