import { ChainId, Identity } from "@iov/bcp";
import { singleton } from "ui-logic";

import { getCodecForChainId } from "../logic/codec";
import { ExtendedIdentity } from "../store/identities";
import developmentConfig from "./development.json";

export interface Config {
  readonly names: { [chainId: string]: string };
  readonly extensionId: string;
  readonly ledger: {
    readonly chainIds: {
      readonly testnetBuild: string;
      readonly mainnetBuild: string;
    };
  };
  readonly websiteName: string;
  readonly chains: readonly ChainConfig[];
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

export interface ConfigErc20Options {
  readonly contractAddress: string;
  readonly symbol: string;
  readonly decimals: number;
}

export interface ChainSpec {
  readonly codecType: string;
  readonly node: string;
  readonly scraper?: string;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly tokens: readonly string[];
}

interface WindowWithConfig extends Window {
  readonly developmentConfig: Config;
}

const loadConfigurationFile = async (): Promise<Config> => {
  if (process.env.NODE_ENV === "test") {
    return (window as WindowWithConfig).developmentConfig;
  }

  if (process.env.NODE_ENV === "development") {
    // This is the `yarn start` case. Only the development config is supported here.
    // If you need to use a different configuration, use yarn build + docker build + docker run.
    return developmentConfig;
  }

  const response = await fetch("/config/conf.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch URL. Response status code: ${response.status}`);
  }

  const json = await response.json();
  return json;
};

export const getConfig = singleton<typeof loadConfigurationFile>(loadConfigurationFile);

/**
 * Gets a chain name from the configuration file. Falls back to the chain ID
 * if no name is found.
 */
export async function getChainName(chainId: ChainId): Promise<string> {
  const chainNames = (await getConfig()).names;

  if (chainNames.hasOwnProperty(chainId)) {
    return chainNames[chainId];
  } else {
    return chainId;
  }
}

export async function makeExtendedIdentities(
  identities: readonly Identity[],
): Promise<Map<ChainId, ExtendedIdentity>> {
  const out = new Map<ChainId, ExtendedIdentity>();
  for (const identity of identities) {
    out.set(identity.chainId, {
      identity: identity,
      address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
      chainName: await getChainName(identity.chainId),
    });
  }
  return out;
}
