/*global chrome*/
import {
  Address,
  Amount,
  ChainId,
  Identity,
  SendTransaction,
  TransactionId,
  UnsignedTransaction,
  WithCreator,
} from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { isJsonRpcErrorResponse, JsonRpcRequest, makeJsonRpcId, parseJsonRpcResponse2 } from '@iov/jsonrpc';

import { getConfig } from '../../config';
import { getCodecForChainId } from '../../logic/codec';
import { getConnectionForChainId } from '../../logic/connection';

async function withChainFee<T extends UnsignedTransaction>(chainId: ChainId, transaction: T): Promise<T> {
  const connection = await getConnectionForChainId(chainId);
  const withFee = await connection.withDefaultFee(transaction);
  return withFee;
}

const generateSignAndPostRequest = async (
  chainId: ChainId,
  creator: Identity,
  recipient: Address,
  amount: Amount,
  memo: string | undefined,
): Promise<JsonRpcRequest> => {
  const codec = await getCodecForChainId(chainId);

  const transactionWithFee: SendTransaction & WithCreator = await withChainFee(chainId, {
    kind: 'bcp/send',
    recipient,
    creator,
    sender: codec.identityToAddress(creator),
    amount: amount,
    memo: memo,
  });
  const tx = TransactionEncoder.toJson(transactionWithFee);

  return {
    jsonrpc: '2.0',
    id: makeJsonRpcId(),
    method: 'signAndPost',
    params: {
      reason: TransactionEncoder.toJson('I would like you to sign this request'),
      transaction: tx,
    },
  };
};

export const sendSignAndPostRequest = async (
  chainId: ChainId,
  creator: Identity,
  recipient: Address,
  amount: Amount,
  memo: string | undefined,
): Promise<TransactionId | null> => {
  const request = await generateSignAndPostRequest(chainId, creator, recipient, amount, memo);

  const config = getConfig();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(config.extensionId, request, response => {
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
