/*global chrome*/
import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';
import { extensionId } from '..';

export const generateGetIdentitiesRequest = (): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: makeJsonRpcId(),
  method: 'getIdentities',
  params: {
    reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});

const isArrayOfPublicIdentity = (data: any): data is ReadonlyArray<PublicIdentity> => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(isPublicIdentity);
};

type GetIdentitiesResponse = ReadonlyArray<PublicIdentity> | undefined;

export const sendGetIdentitiesRequest = async (): Promise<GetIdentitiesResponse> => {
  const request = generateGetIdentitiesRequest();

  return new Promise(resolve => {
    chrome.runtime.sendMessage(extensionId, request, response => {
      if (response === undefined) {
        resolve(undefined);
        return;
      }

      try {
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          resolve([]);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (!isArrayOfPublicIdentity(parsedResult)) {
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
