import { ChainId } from "@iov/bcp";
import { singleton } from "ui-logic";

/*global chrome*/

export type CodecString = "bns" | "lsk" | "eth";

export interface ChainSpec {
  readonly codecType: CodecString;
  readonly node: string;
  readonly scraper?: string;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
}

export interface ChainNames {
  readonly [key: string]: string;
}

export interface BlockExplorers {
  readonly [key: string]: string | null;
}

export interface ConfigurationFile {
  readonly chains: ChainConfig[];
  readonly names: ChainNames;
  readonly blockExplorers: BlockExplorers;
  readonly accountCreationDisabled: boolean;
}

const loadConfigurationFile = async (): Promise<ConfigurationFile> => {
  if (process.env.NODE_ENV === "test") {
    const config = (window as any).config;
    return config;
  }

  const url = chrome.extension.getURL("assets/config/conf.json");
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const getConfigurationFile = singleton<typeof loadConfigurationFile>(loadConfigurationFile);

/**
 * Gets a chain name from the configuration file. Falls back to the chain ID
 * if no name is found.
 */
export async function getChainName(chainId: ChainId): Promise<string> {
  const chainNames = (await getConfigurationFile()).names;

  if (chainNames.hasOwnProperty(chainId)) {
    return chainNames[chainId];
  } else {
    return chainId;
  }
}
