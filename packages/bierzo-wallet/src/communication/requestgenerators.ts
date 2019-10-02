import {
  Address,
  Amount,
  ChainId,
  Identity,
  SendTransaction,
  UnsignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { ChainAddressPair, RegisterUsernameTx } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest, makeJsonRpcId } from "@iov/jsonrpc";

import { getConfig } from "../config";
import { getCodecForChainId } from "../logic/codec";
import { getConnectionForChainId } from "../logic/connection";

export async function generateGetIdentitiesRequest(): Promise<JsonRpcRequest> {
  const chains = (await getConfig()).chains;
  const chainIdsToRequest = chains.map(chain => chain.chainSpec.chainId);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "getIdentities",
    params: {
      reason: TransactionEncoder.toJson("I would like to know who you are on Ethereum"),
      chainIds: TransactionEncoder.toJson(chainIdsToRequest),
    },
  };
}

async function withChainFee<T extends UnsignedTransaction>(chainId: ChainId, transaction: T): Promise<T> {
  const connection = getConnectionForChainId(chainId);
  if (!connection) {
    throw new Error(`Active connection for chain with ${chainId} was not found.`);
  }
  const withFee = await connection.withDefaultFee(transaction);
  return withFee;
}

export const generateSendTxRequest = async (
  creator: Identity,
  recipient: Address,
  amount: Amount,
  memo: string | undefined,
): Promise<JsonRpcRequest> => {
  const codec = await getCodecForChainId(creator.chainId);

  const transactionWithFee: SendTransaction & WithCreator = await withChainFee(creator.chainId, {
    kind: "bcp/send",
    recipient,
    creator,
    sender: codec.identityToAddress(creator),
    amount: amount,
    memo: memo,
  });

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};

export const generateRegisterUsernameTxRequest = async (
  creator: Identity,
  username: string,
  targets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const regUsernameTx: RegisterUsernameTx & WithCreator = {
    kind: "bns/register_username",
    creator,
    username,
    targets,
  };
  const transactionWithFee = await withChainFee(creator.chainId, regUsernameTx);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};
