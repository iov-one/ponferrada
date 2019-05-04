/*global chrome*/
import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';
import { JsonRpcRequest, parseJsonRpcResponse2, isJsonRpcErrorResponse } from '@iov/jsonrpc';
import React from 'react';

function isArrayOfPublicIdentity(data: any): data is ReadonlyArray<PublicIdentity> {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isPublicIdentity);
}

export const ExtensionInteraction = () => {
  React.useEffect(() => {
    setInterval(async () => {
      const extensionId = 'dafekhlcpidfaopcimocbcpciholgkkb';

      const request: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getIdentities',
        params: {
          reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
          chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
        },
      };

      chrome.runtime.sendMessage(extensionId, request, response => {
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          console.log(parsedResponse.error.message);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (isArrayOfPublicIdentity(parsedResult)) {
          const addresses = parsedResult.map(ident => ethereumCodec.identityToAddress(ident));
          console.log(addresses);
        } else {
          console.log('Got unexpected type of result', parsedResult);
        }
      });
    }, 2000);
  }, []);

  return <div>testing interaction with extension</div>;
};
