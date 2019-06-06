import { Address, isPublicIdentity, PublicIdentity, SendTransaction, TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { EthereumConnection } from '@iov/ethereum';
import { JsonRpcRequest, makeJsonRpcId } from '@iov/jsonrpc';

export const buildGetIdentitiesRequest = (method: string, customMessage?: string): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson(
      customMessage ? customMessage : 'I would like to know who you are on Ethereum',
    ),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});

async function withEthereumFee(transaction: SendTransaction): Promise<SendTransaction> {
  const connection = await EthereumConnection.establish('http://localhost:8545', {});
  const withFee = await connection.withDefaultFee(transaction);
  connection.disconnect();
  return withFee;
}

export const generateSignAndPostRequest = async (creator: PublicIdentity): Promise<JsonRpcRequest> => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArrayOfPublicIdentity(data: any): data is ReadonlyArray<PublicIdentity> {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(isPublicIdentity);
}
