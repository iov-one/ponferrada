import { TokenTicker } from '@iov/bcp';
import { singleton } from 'medulas-react-components/lib/utils/singleton';

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
  if (process.env.REACT_APP_CONFIG === 'development') {
    return require('./development.json') as Config;
  }

  if (process.env.REACT_APP_CONFIG === 'staging') {
    return require('./staging.json') as Config;
  }

  if (process.env.REACT_APP_CONFIG === 'production') {
    return require('./production.json') as Config;
  }

  throw new Error('Unexpected REACT_APP_CONFIG variable for obtaining configuration');
};

export const getConfig = singleton<typeof configuration>(configuration);
