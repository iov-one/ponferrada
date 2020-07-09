import { getActiveConnections } from "../../logic/connection";
import { AddTickerActionType, BwToken } from "./reducer";

export async function getTokens(): Promise<{ [ticker: string]: BwToken }> {
  const connections = getActiveConnections();
  const tokens: { [ticker: string]: BwToken } = {};

  for (const connection of connections) {
    const chainTokens = await connection.getAllTokens();

    for (const chainToken of chainTokens) {
      const ticker = chainToken.tokenTicker as string;
      tokens[ticker] = { chainId: connection.chainId, token: chainToken };
    }
  }

  return tokens;
}

export const addTickersAction = (tokens: { [key: string]: BwToken }): AddTickerActionType => ({
  type: "@@tokens/ADD",
  payload: tokens,
});
