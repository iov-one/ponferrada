import { TransactionEncoder } from '@iov/core';
import { JsonRpcRequest } from '@iov/jsonrpc';
import React from 'react';

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
        console.log('Got response', response);
      });
    }, 2000);
  }, []);

  return <div>testing interaction with extension</div>;
};
