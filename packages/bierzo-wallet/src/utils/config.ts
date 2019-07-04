import { TokenTicker } from '@iov/core';
import config from 'config';

let configFile: Config;

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

export async function loadConfig(): Promise<Config> {
  if (configFile) {
    return configFile;
  }

  return (config as unknown) as Config;
}
