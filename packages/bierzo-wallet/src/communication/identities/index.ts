/*global chrome*/
import { Identity, isIdentity } from '@iov/bcp';
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';
import { TransactionEncoder } from '@iov/multichain';

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

/**
 * The response of a "getIdentities" RPC call to the browser extension.
 * `undefined` represents the case that the website could not connect to the
 * extension, i.e. the extension is not available.
 */
export type GetIdentitiesResponse = readonly Identity[] | undefined;

function extensionContext(): boolean {
  return typeof chrome.runtime !== 'undefined' && typeof chrome.runtime.sendMessage !== 'undefined';
}

// exported for testing purposes
export const parseGetIdentitiesResponse = (response: any): readonly Identity[] => {
  const parsedResponse = parseJsonRpcResponse2(response);
  if (isJsonRpcErrorResponse(parsedResponse)) {
    console.error(parsedResponse.error.message);
    throw new Error('Received unexpected json rpc response');
  }

  const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
  if (!isArrayOfIdentity(parsedResult)) {
    throw new Error('Got unexpected type of result');
  }

  return parsedResult;
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
        const identities = parseGetIdentitiesResponse(response);
        resolve(identities);
      } catch (error) {
        console.error(error);
        resolve([]);
      }
    });
  });
};
