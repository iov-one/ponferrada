import { Api } from "logic/api";

import { AddTickerActionType, BwToken } from "./reducer";

export async function getTokens(): Promise<{ [ticker: string]: BwToken }> {
  return Api.getTokens();
}

export const addTickersAction = (tokens: { [key: string]: BwToken }): AddTickerActionType => ({
  type: "@@tokens/ADD",
  payload: tokens,
});
