import { getConfig } from "../../config";
import { getConnectionFor } from "../../logic/connection";
import { AddTickerActionType, BwToken } from "./reducer";

export async function getTokens(): Promise<{ [ticker: string]: BwToken }> {
  const config = await getConfig();
  const tokens: { [ticker: string]: BwToken } = {};
  const chains = config.chains;

  for (const chain of chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId();
    const chainTokens = await connection.getAllTokens();

    for (const chainToken of chainTokens) {
      const ticker = chainToken.tokenTicker as string;
      tokens[ticker] = { chainId, token: chainToken };
    }
  }

  return tokens;
}

export const addTickersAction = (tokens: { [key: string]: BwToken }): AddTickerActionType => ({
  type: "@@tokens/ADD",
  payload: tokens,
});
