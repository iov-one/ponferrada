import { Account, Target, Task } from "logic/api";

export type RpcEndpointType = "ledger" | "extension";

export interface RpcEndpoint {
  readonly authorizeGetIdentitiesMessage: string;
  readonly authorizeSignAndPostMessage: string;
  readonly notAvailableMessage: string;
  readonly noMatchingIdentityMessage: string;
  readonly type: RpcEndpointType;

  resolveStarname: (query: string) => Task<Account>;
  executeRequest: (request: any) => Promise<string | undefined>;
  getTargets: () => Promise<Target[] | undefined>;
}
