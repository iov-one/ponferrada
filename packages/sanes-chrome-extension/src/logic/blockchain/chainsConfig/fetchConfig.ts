import { TokenTicker } from '@iov/bcp';
import { singleton } from '../../../utils/singleton';
import { CodecType } from '../connection';

export interface Config<T extends ChainSpec = ChainSpec> {
  // Note: this is not present on the existing configs
  // readonly bns: ChainConfig<T>;
  readonly chains: ChainConfig<T>[];
}

// We can extend T to also include extra information, such as a chainId field
export interface ChainConfig<T extends ChainSpec = ChainSpec> {
  readonly chainSpec: T;
  readonly faucetSpec?: FaucetSpec;
}

export interface ChainSpec {
  readonly codecType: CodecType;
  readonly bootstrapNodes: ReadonlyArray<string>;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly token: TokenTicker;
}

const fetchConfigData = async (): Promise<Config> => {
  if (process.env.NODE_ENV === 'test') {
    const config = (window as any).config as Config; // eslint-disable-line
    return config;
  }

  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const fetchConfig = singleton<typeof fetchConfigData>(fetchConfigData);
