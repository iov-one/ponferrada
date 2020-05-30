import { Address, TokenTicker } from "@iov/bcp";
import { Erc20Options, Erc20TokensMap } from "@iov/ethereum";

import { ConfigEthereumOptions } from "../extension/background/model/persona/config/configurationfile";

export function getErc20TokensConfig(options: ConfigEthereumOptions): Erc20TokensMap {
  const erc20s = new Map<TokenTicker, Erc20Options>();

  options.erc20s.forEach(row => {
    const ticker = row.symbol as TokenTicker;
    const erc20Option: Erc20Options = {
      contractAddress: row.contractAddress as Address,
      symbol: row.symbol as TokenTicker,
      decimals: row.decimals,
      name: row.name,
    };
    erc20s.set(ticker, erc20Option);
  });

  return erc20s;
}
