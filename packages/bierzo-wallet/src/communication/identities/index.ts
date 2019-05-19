import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';
/*global chrome*/
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';

import { extensionId } from '../';

const generateGetIdentitiesRequest = (): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: makeJsonRpcId(),
  method: 'getIdentities',
  params: {
    reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArrayOfPublicIdentity(data: any): data is ReadonlyArray<PublicIdentity> {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isPublicIdentity);
}

export const sendGetIdentitiesRequest = async (): Promise<ReadonlyArray<PublicIdentity>> => {
  const request = generateGetIdentitiesRequest();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, request, response => {
      try {
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          reject(parsedResponse.error.message);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (isArrayOfPublicIdentity(parsedResult)) {
          const addresses = parsedResult.map(ident => ethereumCodec.identityToAddress(ident));
          console.log(addresses);
          resolve(parsedResult);
        } else {
          reject('Got unexpected type of result');
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
