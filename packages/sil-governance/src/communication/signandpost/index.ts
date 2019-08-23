/* global chrome */
import { TransactionId, WithCreator } from "@iov/bcp";
import { BnsConnection, BnsTx } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse } from "@iov/jsonrpc";

import { getConfig } from "../../config";

async function generateSignAndPostRequest(
  connection: BnsConnection,
  tx: BnsTx & WithCreator,
): Promise<JsonRpcRequest> {
  const txWithFee = await connection.withDefaultFee(tx);
  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      transaction: TransactionEncoder.toJson(txWithFee),
    },
  };
}

export async function sendSignAndPostRequest(
  connection: BnsConnection,
  tx: BnsTx & WithCreator,
): Promise<TransactionId | null> {
  const request = await generateSignAndPostRequest(connection, tx);
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
}
