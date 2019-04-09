import { singleton } from '../../../utils/singleton';
import { CodecType } from '../connection';

export interface ChainSpec {
  readonly codecType: CodecType;
  readonly bootstrapNodes: ReadonlyArray<string>;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly token: string;
}

// We can extend T to also include extra information, such as a chainId field
export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

export interface FullConfigurationFile {
  readonly chains: ChainConfig[];
}

const fetchConfigData = async (): Promise<FullConfigurationFile> => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (window as any).config;
    return config;
  }

  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const fetchConfig = singleton<typeof fetchConfigData>(fetchConfigData);
