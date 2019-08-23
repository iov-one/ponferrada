/*global chrome*/
import { ChainId, Identity, isIdentity } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse } from "@iov/jsonrpc";

import { getConfig } from "../../config";
import { getBnsConnection } from "../../logic/connection";

export const generateGetIdentitiesRequest = (bnsChainId: ChainId): JsonRpcRequest => ({
  jsonrpc: "2.0",
  id: makeJsonRpcId(),
  method: "getIdentities",
  params: {
    reason: TransactionEncoder.toJson("I would like to know who you are on BNS"),
    chainIds: TransactionEncoder.toJson([bnsChainId]),
  },
});

const isArrayOfIdentity = (data: any): data is readonly Identity[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(isIdentity);
};

type GetIdentitiesResponse = readonly Identity[] | undefined;

function extensionContext(): boolean {
  return typeof chrome.runtime !== "undefined" && typeof chrome.runtime.sendMessage !== "undefined";
}

export const sendGetIdentitiesRequest = async (): Promise<GetIdentitiesResponse> => {
  const connection = await getBnsConnection();

  const request = generateGetIdentitiesRequest(connection.chainId());

  const isValid = extensionContext();
  if (!isValid) {
    return undefined;
  }

  const config = await getConfig();

  return new Promise(resolve => {
    chrome.runtime.sendMessage(config.extensionId, request, response => {
      if (response === undefined) {
        resolve(undefined);
        return;
      }

      try {
        const parsedResponse = parseJsonRpcResponse(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          resolve([]);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (!isArrayOfIdentity(parsedResult)) {
          resolve([]);
          return;
        }

        resolve(parsedResult);
      } catch {
        resolve([]);
      }
    });
  });
};
