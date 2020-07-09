import { singleton } from "ui-logic";

import { ExtendedIdentity } from "store/identities";
import developmentConfig from "./development.json";
import { Target } from "logic/api";

/** The string value must match the codec type in the config file */
export enum CodecType {
  Bns = "bns",
  Ethereum = "eth",
  Iovns = "iovns",
  Lisk = "lsk",
  Cosmos = "cosmos",
}

export interface Config {
  readonly extensionId: string;
  readonly extensionLink: string;
  readonly neumaUrl: string;
  readonly ledger: {
    readonly chainIds: {
      readonly testnetBuild: string;
      readonly mainnetBuild: string;
    };
  };
  readonly websiteName: string;
  readonly chains: readonly ChainConfig[];
  readonly supportedChains: readonly SupportedChain[];
  readonly addressPrefix: string;
  readonly tokenConfiguration: any;
}

export interface SupportedChain {
  readonly chainId: string;
  readonly name: string;
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

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

/** Like ChainConfig but with non-optional faucet */
export interface ChainConfigWithFaucet extends ChainConfig {
  readonly faucetSpec: FaucetSpec;
}

export function isChainConfigWithFaucet(chain: ChainConfig): chain is ChainConfigWithFaucet {
  return !!chain.faucetSpec;
}

export interface ChainSpec {
  readonly codecType: CodecType;
  readonly chainId: string;
  readonly name: string;
  readonly node: string;
  readonly scraper?: string;
  readonly ethereumOptions?: ConfigEthereumOptions;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly tokens: readonly string[];
}

interface WindowWithConfig extends Window {
  readonly developmentConfig: Config;
}

function getWindowWithConfig(): WindowWithConfig {
  return (window as Window) as WindowWithConfig;
}

async function loadConfigurationFile(): Promise<Config> {
  if (process.env.NODE_ENV === "test") {
    return getWindowWithConfig().developmentConfig;
  }

  // We don't have type checks that ensure the runtime value match
  let uncheckedConfig: any;

  if (process.env.NODE_ENV === "development") {
    // This is the `yarn start` case. Only the development config is supported here.
    // If you need to use a different configuration, use yarn build + docker build + docker run.
    uncheckedConfig = developmentConfig;
  } else {
    const response = await fetch("/config/conf.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch URL. Response status code: ${response.status}`);
    }
    uncheckedConfig = await response.json();
  }

  return uncheckedConfig;
}

export const getConfig = singleton<typeof loadConfigurationFile>(loadConfigurationFile);

/**
 * Gets a chain name from the configuration file. Falls back to the chain ID
 * if no name is found.
 */
export async function getChainName(chainId: string): Promise<string> {
  const chains = (await getConfig()).supportedChains;
  const selectedChain = chains.find(chain => chain.chainId === chainId);
  if (selectedChain) {
    return selectedChain.name;
  } else {
    return chainId;
  }
}

export async function makeExtendedIdentities(
  targets: readonly Target[],
): Promise<Map<string, ExtendedIdentity>> {
  const out = new Map<string, ExtendedIdentity>();
  for (const target of targets) {
    out.set(target.id, {
      identity: target,
      address: target.address,
      chainName: await getChainName(target.id),
    });
  }
  return out;
}
