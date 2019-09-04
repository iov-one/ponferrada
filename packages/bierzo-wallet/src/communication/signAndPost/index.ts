/*global chrome*/
import { TransactionId } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, JsonRpcRequest, parseJsonRpcResponse } from "@iov/jsonrpc";

import { getConfig } from "../../config";

export const sendSignAndPostRequest = async (request: JsonRpcRequest): Promise<TransactionId | null> => {
  const config = await getConfig();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(config.extensionId, request, response => {
      try {
        const parsedResponse = parseJsonRpcResponse(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          reject(parsedResponse.error.message);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (typeof parsedResult === "string") {
          resolve(parsedResult as TransactionId);
        } else if (parsedResult === null) {
          resolve(null);
        } else {
          reject("Got unexpected type of result");
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
