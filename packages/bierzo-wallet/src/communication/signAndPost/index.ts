/*global chrome*/
import {
  Address,
  Identity,
  SendTransaction,
  TokenTicker,
  TransactionId,
  UnsignedTransaction,
  WithCreator,
} from '@iov/bcp';
import { ethereumCodec, EthereumConnection } from '@iov/ethereum';
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';
import { TransactionEncoder } from '@iov/multichain';

import { extensionId } from '..';

async function withEthereumFee<T extends UnsignedTransaction>(transaction: T): Promise<T> {
  const connection = await EthereumConnection.establish('http://localhost:8545', {});
  const withFee = await connection.withDefaultFee(transaction);
  connection.disconnect();
  return withFee;
}

const generateSignAndPostRequest = async (creator: Identity): Promise<JsonRpcRequest> => {
  const transactionWithFee: SendTransaction & WithCreator = await withEthereumFee({
    kind: 'bcp/send',
    recipient: '0x0000000000000000000000000000000000000000' as Address,
    creator: creator,
    sender: ethereumCodec.identityToAddress(creator),
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

export const sendSignAndPostRequest = async (creator: Identity): Promise<TransactionId | null> => {
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
