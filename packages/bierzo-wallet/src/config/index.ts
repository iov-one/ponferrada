import { ChainId } from "@iov/bcp";
import { singleton } from "medulas-react-components/lib/utils/singleton";

import developmentConfig from "./development.json";
import productionConfig from "./production.json";
import stagingConfig from "./staging.json";

export interface Config {
  readonly names: { [chainId: string]: string };
  readonly extensionId: string;
  readonly chains: ReadonlyArray<ChainConfig>;
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
  readonly tokens: ReadonlyArray<string>;
}

const configuration = (): Config => {
  if (process.env.REACT_APP_CONFIG === "development") {
    return developmentConfig;
  }

  if (process.env.REACT_APP_CONFIG === "staging") {
    return stagingConfig;
  }

  if (process.env.REACT_APP_CONFIG === "production") {
    return productionConfig;
  }

  throw new Error("Unexpected REACT_APP_CONFIG variable for obtaining configuration");
};

export const getConfig = singleton<typeof configuration>(configuration);

/**
 * Gets a chain name from the configuration file. Falls back to the chain ID
 * if no name is found.
 */
export function getChainName(chainId: ChainId): string {
  const chainNames = getConfig().names;

  if (chainNames.hasOwnProperty(chainId)) {
    return chainNames[chainId];
  } else {
    return chainId;
  }
}
