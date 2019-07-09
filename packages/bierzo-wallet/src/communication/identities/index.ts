/*global chrome*/
import { Identity, isIdentity } from '@iov/bcp';
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

function isArrayOfIdentity(data: any): data is ReadonlyArray<Identity> {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isIdentity);
}

type GetIdentitiesResponse = { [chain: string]: Identity } | undefined;

function extensionContext(): boolean {
  return typeof chrome.runtime !== 'undefined' && typeof chrome.runtime.sendMessage !== 'undefined';
}

// exported for testing purposes
export const parseGetIdentitiesResponse = (response: any): { [chain: string]: Identity } => {
  const parsedResponse = parseJsonRpcResponse2(response);
  if (isJsonRpcErrorResponse(parsedResponse)) {
    console.error(parsedResponse.error.message);
    throw new Error('Received unexpected json rpc response');
  }

  const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
  if (!isArrayOfIdentity(parsedResult)) {
    throw new Error('Got unexpected type of result');
  }

  const keys: { [chain: string]: Identity } = {};
  for (const id of parsedResult) {
    keys[id.chainId] = id;
  }

  return keys;
};

export const sendGetIdentitiesRequest = async (): Promise<GetIdentitiesResponse> => {
  const chains = ['ethereum-eip155-5777', 'local-bns-devnet'];
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
        const keys = parseGetIdentitiesResponse(response);
        resolve(keys);
      } catch (error) {
        console.error(error);
        resolve({});
      }
    });
  });
};
