/*global chrome*/
import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';
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
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          console.error(parsedResponse.error.message);
          resolve({});
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (!isArrayOfPublicIdentity(parsedResult)) {
          console.error('Got unexpected type of result');
          resolve({});
          return;
        }

        // TODO remove when the app evolves
        const addresses = parsedResult.map(ident => ethereumCodec.identityToAddress(ident));
        console.log(addresses);

        const keys: { [chain: string]: PublicIdentity } = {};
        for (let i = 0; i < parsedResult.length; i++) {
          const chain = chains[i];
          keys[chain] = parsedResult[i];
        }

        resolve(keys);
      } catch (error) {
        console.error(error);
        resolve({});
      }
    });
  });
};
