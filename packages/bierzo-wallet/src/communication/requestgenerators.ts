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
import { getConnectionFor, getConnectionForChainId } from "../logic/connection";

export async function generateGetIdentitiesRequest(): Promise<JsonRpcRequest> {
  const connections = await Promise.all(
    (await getConfig()).chains.map(config => getConnectionFor(config.chainSpec)),
  );
  const supportedChainIds = connections.map(connection => connection.chainId());

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "getIdentities",
    params: {
      reason: TransactionEncoder.toJson("I would like to know who you are on Ethereum"),
      chainIds: TransactionEncoder.toJson(supportedChainIds),
    },
  };
}

async function withChainFee<T extends UnsignedTransaction>(chainId: ChainId, transaction: T): Promise<T> {
  const connection = await getConnectionForChainId(chainId);
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
  const tx = TransactionEncoder.toJson(transactionWithFee);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      transaction: tx,
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

  const tx = TransactionEncoder.toJson(transactionWithFee);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      transaction: tx,
    },
  };
};
