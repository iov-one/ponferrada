import { Account, Target, Task } from "logic/api";

import { RpcEndpoint } from "./rpcEndpoint";

export const extensionRpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "Please authorize request in Neuma Browser Extension to continue.",
  authorizeSignAndPostMessage: "Please authorize request in Neuma Browser Extension to continue.",
  notAvailableMessage: "You need to install the Neuma browser extension.",
  noMatchingIdentityMessage: "Please unlock Neuma to continue.",
  type: "extension",
  resolveStarname: (query: string): Task<Account> => {
    return {
      run: () => Promise.resolve<Account>({} as Account),
      abort: () => null,
    };
  },
  executeRequest: async (request: any): Promise<string | undefined> => undefined,
  getTargets: async (): Promise<Target[]> => [],
};
