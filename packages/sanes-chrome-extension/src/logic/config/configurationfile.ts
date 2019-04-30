import { singleton } from '../../utils/singleton';

export type CodecString = 'bns' | 'bov' | 'lsk' | 'eth';

export interface ChainSpec {
  readonly codecType: CodecString;
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

export interface ConfigurationFile {
  readonly chains: ChainConfig[];
}

const loadConfigurationFile = async (): Promise<ConfigurationFile> => {
  console.log('loadConfigurationFile 1');
  if (process.env.NODE_ENV === 'test') {
    console.log('loadConfigurationFile 1A');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (window as any).config;
    console.log('loadConfigurationFile 1A ' + config);
    return config;
  }
  console.log('loadConfigurationFile 1B');
  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();
  console.log('loadConfigurationFile 1B ' + json);

  return json;
};

export const getConfigurationFile = singleton<typeof loadConfigurationFile>(loadConfigurationFile);
