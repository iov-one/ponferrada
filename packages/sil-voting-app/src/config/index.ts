import { singleton } from "medulas-react-components/lib/utils/singleton";

import developmentConfig from "./development.json";
import productionConfig from "./production.json";
import stagingConfig from "./staging.json";

export interface Config {
  readonly extensionId: string;
  readonly bnsChain: ChainConfig;
}

export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
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

const configuration = async (): Promise<Config> => {
  console.log(process.env.REACT_APP_CONFIG);
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
