import { ChainId } from "@iov/bcp";
import { singleton } from "medulas-react-components/lib/utils/singleton";

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

const loadConfigurationFile = async (): Promise<Config> => {
  if (process.env.NODE_ENV === "test") {
    const config = (window as any).config;
    return config;
  }

  const data = await fetch("/static/config/conf.json");
  const json = await data.json();

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
