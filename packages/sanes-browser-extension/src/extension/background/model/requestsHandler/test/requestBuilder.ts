import { Address, Identity, isIdentity, SendTransaction, TokenTicker, UnsignedTransaction } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { ethereumCodec, EthereumConnection } from "@iov/ethereum";
import { JsonRpcRequest, makeJsonRpcId } from "@iov/jsonrpc";

export const buildGetIdentitiesRequest = (method: string, customMessage?: string): JsonRpcRequest => ({
  jsonrpc: "2.0",
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson(
      customMessage ? customMessage : "I would like to know who you are on Ethereum",
    ),
    chainIds: TransactionEncoder.toJson(["ethereum-eip155-5777"]),
  },
});

async function withEthereumFee<T extends UnsignedTransaction>(transaction: T): Promise<T> {
  const connection = await EthereumConnection.establish("http://localhost:8545", {});
  const withFee = await connection.withDefaultFee(transaction);
  connection.disconnect();
  return withFee;
}

export const generateSignAndPostRequest = async (sender: Identity): Promise<JsonRpcRequest> => {
  const transactionWithFee: SendTransaction = await withEthereumFee({
    kind: "bcp/send",
    chainId: sender.chainId,
    recipient: "0x0000000000000000000000000000000000000000" as Address,
    sender: ethereumCodec.identityToAddress(sender),
    amount: {
      quantity: "1234000000000000000",
      fractionalDigits: 18,
      tokenTicker: "ETH" as TokenTicker,
    },
  });

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      signer: TransactionEncoder.toJson(sender),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};

export function isArrayOfIdentity(data: any): data is readonly Identity[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(isIdentity);
}
