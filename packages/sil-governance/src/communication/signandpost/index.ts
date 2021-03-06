/* global chrome */
import { Identity, TransactionId } from "@iov/bcp";
import { bnsCodec, BnsConnection, BnsTx } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse } from "@iov/jsonrpc";

import { browserExtensionErrorCodes, SignAndPostResponse } from "..";
import { getConfig } from "../../config";

function isExtensionContext(): boolean {
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.sendMessage !== "undefined"
  );
}

async function generateSignAndPostRequest(
  connection: BnsConnection,
  signer: Identity,
  tx: BnsTx,
): Promise<JsonRpcRequest> {
  const txWithFee = await connection.withDefaultFee(tx, bnsCodec.identityToAddress(signer));
  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      signer: TransactionEncoder.toJson(signer),
      transaction: TransactionEncoder.toJson(txWithFee),
    },
  };
}

/**
 * @returns a response or `undefined` if the endpoint was not available
 */
export async function sendSignAndPostRequest(
  connection: BnsConnection,
  signer: Identity,
  tx: BnsTx,
): Promise<SignAndPostResponse | undefined | "not_ready"> {
  if (!isExtensionContext()) return undefined;

  const request = await generateSignAndPostRequest(connection, signer, tx);
  const config = await getConfig();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(config.extensionId, request, response => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
        return;
      }

      try {
        const parsedResponse = parseJsonRpcResponse(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          switch (parsedResponse.error.code) {
            case browserExtensionErrorCodes.signingServerNotReady:
              resolve("not_ready");
              return;
            default:
              reject(parsedResponse.error.message);
              return;
          }
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
