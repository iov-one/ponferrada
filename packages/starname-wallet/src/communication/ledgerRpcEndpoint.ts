import Ledger from "./ledger";
import { RpcEndpoint } from "./rpcEndpoint";
import { Api, Target, Account, Task } from "logic/api";

/*async function getLedgerAddress(ledger: Ledger): Promise<Record<string, any>> {
  const pubkey = await ledger.getPubKey(); // throws on error
  const address = await ledger.getIovAddress(); // throws on error
  const addressResponse = {
    address: address,
    errorMessage: "No errors", // HARD-CODED in conjunction with ledger.getPubKey()
    pubkey: pubkey,
    returnCode: 36864, // HARD-CODED in conjunction with ledger.getPubKey()
  };
  return addressResponse;
}*/

export const ledgerRpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "Waiting for Ledger device to provide identity...",
  authorizeSignAndPostMessage: "Please sign transaction on Ledger device to continue.",
  notAvailableMessage: "Please connect your Ledger Nano S, open the IOV app and try again.",
  noMatchingIdentityMessage: "No matching identity found. Did you open the correct app?",
  type: "ledger",
  resolveStarname: (query: string): Task<Account> => {
    return Api.resolveStarname(query);
  },
  executeRequest: async (request: any): Promise<string | undefined> => {
    return undefined;
  },
  getTargets: async (): Promise<Target[]> => {
    const ledger: Ledger = new Ledger({
      testModeAllowed: true,
    });
    return [
      {
        id: await Api.getChainId(),
        address: await ledger.getIovAddress(),
      },
    ];
  },
};
