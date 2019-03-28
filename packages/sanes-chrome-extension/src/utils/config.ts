import { TokenTicker } from '@iov/bcp';
import { singleton } from './singleton';
import { CodecType } from '../logic/blockchain/connection';

export interface Config {
  readonly bns: ChainConfig;
  readonly chains: ReadonlyArray<ChainConfig>;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

export interface ChainSpec {
  readonly codecType: CodecType;
  readonly bootstrapNodes: ReadonlyArray<string>;
}

interface FaucetSpec {
  readonly uri: string;
  readonly token: TokenTicker;
}

const fetchConfig = async (): Promise<Config> => {
  if (process.env.NODE_ENV === 'test') {
    const config = (window as any).config as Config; // eslint-disable-line
    return config;
  }

  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const getConfig = singleton<typeof fetchConfig>(fetchConfig);
