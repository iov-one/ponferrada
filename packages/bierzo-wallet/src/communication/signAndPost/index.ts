/*global chrome*/
import { JsonRpcRequest, parseJsonRpcResponse2, isJsonRpcErrorResponse, makeJsonRpcId } from '@iov/jsonrpc';
import { TransactionEncoder } from '@iov/core';
import { PublicIdentity, SendTransaction, Address, TokenTicker, TransactionId } from '@iov/bcp';
import { EthereumConnection } from '@iov/ethereum';
import { extensionId } from '..';

async function withEthereumFee(transaction: SendTransaction): Promise<SendTransaction> {
  const connection = await EthereumConnection.establish('http://localhost:8545', {});
  const withFee = await connection.withDefaultFee(transaction);
  connection.disconnect();
  return withFee;
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

export const sendSignAndPostRequest = async (creator: PublicIdentity): Promise<TransactionId | null> => {
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
        } else if (parsedResult === null) {
          resolve(null);
        } else {
          reject('Got unexpected type of result');
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
