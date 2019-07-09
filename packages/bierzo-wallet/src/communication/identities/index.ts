/*global chrome*/
import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';

import { extensionId } from '..';

export const generateGetIdentitiesRequest = (chains: ReadonlyArray<string>): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: makeJsonRpcId(),
  method: 'getIdentities',
  params: {
    reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
    chainIds: TransactionEncoder.toJson(chains),
  },
});

function isArrayOfPublicIdentity(data: any): data is ReadonlyArray<PublicIdentity> {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isPublicIdentity);
}

type GetIdentitiesResponse = { [chain: string]: PublicIdentity } | undefined;

function extensionContext(): boolean {
  return typeof chrome.runtime !== 'undefined' && typeof chrome.runtime.sendMessage !== 'undefined';
}

// exported for testing purposes
export const parseGetIdentitiesResponse = (
  response: any,
  chains: ReadonlyArray<string>,
): { [chain: string]: PublicIdentity } => {
  const parsedResponse = parseJsonRpcResponse2(response);
  if (isJsonRpcErrorResponse(parsedResponse)) {
    console.error(parsedResponse.error.message);
    throw new Error('Received unexpected json rpc response');
  }

  const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
  if (!isArrayOfPublicIdentity(parsedResult)) {
    throw new Error('Got unexpected type of result');
  }

  const keys: { [chain: string]: PublicIdentity } = {};
  for (let i = 0; i < parsedResult.length; i++) {
    const chain = chains[i];
    keys[chain] = parsedResult[i];
  }

  return keys;
};

export const sendGetIdentitiesRequest = async (): Promise<GetIdentitiesResponse> => {
  const chains = ['ethereum-eip155-5777'];
  const request = generateGetIdentitiesRequest(chains);

  const isValid = extensionContext();
  if (!isValid) {
    return undefined;
  }

  return new Promise(resolve => {
    chrome.runtime.sendMessage(extensionId, request, response => {
      if (response === undefined) {
        resolve(undefined);
        return;
      }

      try {
        const keys = parseGetIdentitiesResponse(response, chains);
        resolve(keys);
      } catch (error) {
        console.error(error);
        resolve({});
      }
    });
  });
};
