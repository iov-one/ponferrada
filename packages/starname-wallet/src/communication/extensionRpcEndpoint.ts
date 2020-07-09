import { Identity, isIdentity } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, parseJsonRpcResponse } from "@iov/jsonrpc";
import { RpcEndpoint } from "./rpcEndpoint";
import { Target, Account, Task } from "logic/api";

function isExtensionContext(): boolean {
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.sendMessage !== "undefined"
  );
}

function isArrayOfIdentity(data: any): data is readonly Identity[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isIdentity);
}

function parseGetIdentitiesResponse(response: any): readonly Identity[] {
  const parsedResponse = parseJsonRpcResponse(response);
  if (isJsonRpcErrorResponse(parsedResponse)) {
    console.error(parsedResponse.error.message);
    throw new Error("Received unexpected json rpc response");
  }

  const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
  if (!isArrayOfIdentity(parsedResult)) {
    throw new Error("Got unexpected type of result");
  }

  return parsedResult;
}

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
