import { Address, PublicIdentity, SendTransaction, TokenTicker, TransactionId } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { EthereumConnection } from '@iov/ethereum';
/*global chrome*/
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';

import { extensionId } from '../';

async function withEthereumFee(transaction: SendTransaction): Promise<SendTransaction> {
  const connection = await EthereumConnection.establish('http://localhost:8545');
  const fee = await connection.getFeeQuote(transaction);
  connection.disconnect();
  return { ...transaction, fee: fee };
}

const generateSignAndPostRequest = async (creator: PublicIdentity): Promise<JsonRpcRequest> => {
  const transactionWithFee: SendTransaction = await withEthereumFee({
    kind: 'bcp/send',
    recipient: '0x0000000000000000000000000000000000000000' as Address,
    creator: creator,
    amount: {
      quantity: '1234000000000000000',
      fractionalDigits: 18,
      tokenTicker: 'ETH' as TokenTicker,
    },
  });

  return {
    jsonrpc: '2.0',
    id: makeJsonRpcId(),
    method: 'signAndPost',
    params: {
      reason: TransactionEncoder.toJson('I would like you to sign this request'),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};

export const sendSignAndPostRequest = async (creator: PublicIdentity): Promise<TransactionId> => {
  const request = await generateSignAndPostRequest(creator);

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, request, response => {
      try {
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          reject(parsedResponse.error.message);
          return;
        }

        const parsedResult = TransactionEncoder.fromJson(parsedResponse.result);
        if (typeof parsedResult === 'string') {
          resolve(parsedResult as TransactionId);
        } else {
          reject('Got unexpected type of result');
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
