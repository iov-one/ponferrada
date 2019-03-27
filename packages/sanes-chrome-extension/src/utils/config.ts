import { TokenTicker } from '@iov/bcp';
import { singleton } from './singleton';

export interface Config {
  readonly bns: ChainConfig;
  readonly chains: ReadonlyArray<ChainConfig>;
}

interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

interface ChainSpec {
  readonly codecType: string;
  readonly bootstrapNodes: ReadonlyArray<string>;
}

interface FaucetSpec {
  readonly uri: string;
  readonly token: TokenTicker;
}

const fetchConfig = async (): Promise<Config> => {
  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const getConfig = singleton<typeof fetchConfig>(fetchConfig);
