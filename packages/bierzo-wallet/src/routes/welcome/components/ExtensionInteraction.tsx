import { isPublicIdentity, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';
import { JsonRpcRequest, parseJsonRpcErrorResponse, parseJsonRpcSuccessResponse } from '@iov/jsonrpc';
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
        // Simplify parsing of `response` with IOV-Core 0.15.0+
        // https://github.com/iov-one/iov-core/issues/939

        try {
          const errorResponse = parseJsonRpcErrorResponse(response);
          console.log(errorResponse.error.message);
          return;
        } catch (_) {}

        try {
          const successResponse = parseJsonRpcSuccessResponse(response);
          const parsedResult = TransactionEncoder.fromJson(successResponse.result);
          if (isArrayOfPublicIdentity(parsedResult)) {
            console.log(parsedResult.map(ident => ethereumCodec.identityToAddress(ident)));
          } else {
            console.log('Got unexpected type of result', parsedResult);
          }
          return;
        } catch (_) {}

        console.error('Response was no valid JSON-RPC error or success');
      });
    }, 2000);
  }, []);

  return <div>testing interaction with extension</div>;
};
