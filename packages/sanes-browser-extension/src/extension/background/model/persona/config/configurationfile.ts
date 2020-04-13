import { TokenConfiguration } from "@cosmwasm/bcp";
import { ChainId } from "@iov/bcp";
import { singleton } from "ui-logic";

import { getBnsRpc } from "../../../../../utils/localstorage/bnsRpc";

/** The string value must match the codec type in the config file */
export enum CodecType {
  Bns = "bns",
  Ethereum = "eth",
  CosmWasm = "cosmwasm",
  Lisk = "lsk",
}

export interface ConfigErc20Options {
  readonly name?: string;
  readonly contractAddress: string;
  readonly symbol: string;
  readonly decimals: number;
}

export interface ConfigEthereumOptions {
  readonly erc20s: readonly ConfigErc20Options[];
}

export interface ChainSpec {
  readonly codecType: CodecType;
  readonly node: string;
  readonly name: string;
  readonly chainId: ChainId;
  readonly scraper?: string;
  readonly tokenConfig?: TokenConfiguration;
  readonly ethereumOptions?: ConfigEthereumOptions;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
}

export interface BlockExplorers {
  readonly [key: string]: string | undefined;
}

export interface ConfigurationFile {
  readonly chains: ChainConfig[];
  readonly blockExplorers: BlockExplorers;
  /** If set to true, wallet creation is disabled. Unsets is interpreted as false. */
  readonly walletCreationDisabled?: boolean;
  /** If set to true, account creation is disabled. Unsets is interpreted as false. */
  readonly accountCreationDisabled?: boolean;
  /** Producation environment flag */
  readonly production?: boolean;
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
  const chains = await getChains();
  const selectedChain = chains.find(chain => chain.chainSpec.chainId === chainId);

  if (selectedChain) {
    return selectedChain.chainSpec.name;
  } else {
    return chainId;
  }
}

export async function getChainNode(chainId: ChainId): Promise<string> {
  const chains = await getChains();
  const selectedChain = chains.find(chain => chain.chainSpec.chainId === chainId);

  if (selectedChain) {
    return selectedChain.chainSpec.node;
  } else {
    return "";
  }
}

export async function getChains(): Promise<ChainConfig[]> {
  const config = await getConfigurationFile();
  const chains = config.chains;
  if (config.production) {
    return chains;
  }
  const bnsRpcConfig = getBnsRpc();
  if (bnsRpcConfig) {
    const bnsChain = chains.find(chain => chain.chainSpec.codecType === "bns");
    if (!bnsChain) {
      return chains;
    }

    const updatedBns = {
      chainSpec: {
        ...bnsChain.chainSpec,
        name: bnsRpcConfig.networkName,
        node: bnsRpcConfig.rpcUrl,
      },
    };

    const withoutBns = chains.filter(chain => chain.chainSpec.codecType !== "bns");
    return [updatedBns, ...withoutBns];
  }

  return chains;
}
