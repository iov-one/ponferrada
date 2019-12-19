import { Address, Amount, Identity, SendTransaction, UnsignedTransaction } from "@iov/bcp";
import { bnsCodec, ChainAddressPair, RegisterUsernameTx, UpdateTargetsOfUsernameTx } from "@iov/bns";
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

async function withChainFee<T extends UnsignedTransaction>(transaction: T, feePayer: Address): Promise<T> {
  const connection = getConnectionForChainId(transaction.chainId);
  if (!connection) {
    throw new Error(`Active connection for chain with ${transaction.chainId} was not found.`);
  }
  const withFee = await connection.withDefaultFee(transaction, feePayer);
  return withFee;
}

export const generateSendTxRequest = async (
  sender: Identity,
  recipient: Address,
  amount: Amount,
  memo: string | undefined,
): Promise<JsonRpcRequest> => {
  const codec = await getCodecForChainId(sender.chainId);

  const senderAddress = codec.identityToAddress(sender);
  const transactionWithFee: SendTransaction = await withChainFee(
    {
      kind: "bcp/send",
      chainId: sender.chainId,
      recipient,
      senderPubkey: sender.pubkey,
      sender: senderAddress,
      amount: amount,
      memo: memo,
    },
    senderAddress,
  );

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

export const generateRegisterUsernameTxWithFee = async (
  creator: Identity,
  username: string,
  targets: readonly ChainAddressPair[],
): Promise<RegisterUsernameTx> => {
  const regUsernameTx: RegisterUsernameTx = {
    kind: "bns/register_username",
    chainId: creator.chainId,
    username,
    targets,
  };

  return withChainFee(regUsernameTx, bnsCodec.identityToAddress(creator));
};

export const generateUpdateUsernameTxWithFee = async (
  creator: Identity,
  username: string,
  targets: readonly ChainAddressPair[],
): Promise<UpdateTargetsOfUsernameTx> => {
  const regUsernameTx: UpdateTargetsOfUsernameTx = {
    kind: "bns/update_targets_of_username",
    chainId: creator.chainId,
    username,
    targets,
  };

  return await withChainFee(regUsernameTx, bnsCodec.identityToAddress(creator));
};

export const generateRegisterUsernameTxRequest = async (
  creator: Identity,
  username: string,
  targets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRegisterUsernameTxWithFee(creator, username, targets);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      signer: TransactionEncoder.toJson(creator),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};

export const generateUpdateUsernameTxRequest = async (
  creator: Identity,
  username: string,
  targets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateUpdateUsernameTxWithFee(creator, username, targets);

  return {
    jsonrpc: "2.0",
    id: makeJsonRpcId(),
    method: "signAndPost",
    params: {
      reason: TransactionEncoder.toJson("I would like you to sign this request"),
      signer: TransactionEncoder.toJson(creator),
      transaction: TransactionEncoder.toJson(transactionWithFee),
    },
  };
};
