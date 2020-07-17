import { Account, Coin, Transaction } from "logic/api";
import { Task } from "logic/http";

export type RpcEndpointType = "ledger" | "extension";

export interface RpcEndpoint {
  readonly authorizeGetIdentitiesMessage: string;
  readonly authorizeSignAndPostMessage: string;
  readonly notAvailableMessage: string;
  readonly noMatchingIdentityMessage: string;
  readonly type: RpcEndpointType;

  resolveStarname(query: string): Task<Account>;
  executeRequest(request: any): Promise<string | undefined>;
  start(): Promise<boolean>;
  getBalances(): Promise<Coin[]>;
  getTransactions(): Promise<Transaction[]>;
}
