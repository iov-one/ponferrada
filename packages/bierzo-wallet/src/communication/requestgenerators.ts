import { Address, Amount, Identity, SendTransaction, UnsignedTransaction } from "@iov/bcp";
import {
  bnsCodec,
  ChainAddressPair,
  RegisterAccountTx,
  RegisterDomainTx,
  RegisterUsernameTx,
  ReplaceAccountTargetsTx,
  TransferDomainTx,
  TransferUsernameTx,
  UpdateTargetsOfUsernameTx,
} from "@iov/bns";
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

export const generateTransferUsernameTxWithFee = async (
  creator: Identity,
  username: string,
  newOwner: Address,
): Promise<TransferUsernameTx> => {
  const transferUsernameTx: TransferUsernameTx = {
    kind: "bns/transfer_username",
    chainId: creator.chainId,
    username,
    newOwner,
  };

  return withChainFee(transferUsernameTx, bnsCodec.identityToAddress(creator));
};

export const generateRegisterDomainTxWithFee = async (
  creator: Identity,
  domain: string,
): Promise<RegisterDomainTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);
  const TwoHoursInSeconds = 2 * 3600; // FIXME: I think we need to change this before release.

  const regDomainTx: RegisterDomainTx = {
    kind: "bns/register_domain",
    chainId: creator.chainId,
    domain: domain,
    admin: creatorAddress,
    hasSuperuser: true,
    msgFees: [],
    accountRenew: TwoHoursInSeconds,
  };

  return await withChainFee(regDomainTx, creatorAddress);
};

export const generateTransferDomainTxWithFee = async (
  creator: Identity,
  domain: string,
  newAdmin: Address,
): Promise<TransferDomainTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);

  const regDomainTx: TransferDomainTx = {
    kind: "bns/transfer_domain",
    chainId: creator.chainId,
    domain: domain,
    newAdmin: newAdmin,
  };

  return await withChainFee(regDomainTx, creatorAddress);
};

export const generateRegisterAccountTxWithFee = async (
  creator: Identity,
  domain: string,
  name: string,
  owner: Address,
  targets: readonly ChainAddressPair[],
): Promise<RegisterAccountTx> => {
  const regAccountTx: RegisterAccountTx = {
    kind: "bns/register_account",
    chainId: creator.chainId,
    domain: domain,
    name: name,
    owner: owner,
    targets: targets,
  };

  return await withChainFee(regAccountTx, bnsCodec.identityToAddress(creator));
};

export const generateReplaceAccountTargetsTxWithFee = async (
  creator: Identity,
  domain: string,
  name: string,
  newTargets: readonly ChainAddressPair[],
): Promise<ReplaceAccountTargetsTx> => {
  const regAccountTx: ReplaceAccountTargetsTx = {
    kind: "bns/replace_account_targets",
    chainId: creator.chainId,
    domain: domain,
    name: name,
    newTargets: newTargets,
  };

  return await withChainFee(regAccountTx, bnsCodec.identityToAddress(creator));
};

export const generateTransferUsernameTxRequest = async (
  creator: Identity,
  username: string,
  newOwner: Address,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateTransferUsernameTxWithFee(creator, username, newOwner);

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

export const generateRegisterDomainTxRequest = async (
  creator: Identity,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRegisterDomainTxWithFee(creator, domain);

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

export const generateTransferDomainTxRequest = async (
  creator: Identity,
  domain: string,
  newOwner: Address,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateTransferDomainTxWithFee(creator, domain, newOwner);

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

export const generateRegisterAccountTxRequest = async (
  creator: Identity,
  domain: string,
  name: string,
  owner: Address,
  targets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRegisterAccountTxWithFee(creator, domain, name, owner, targets);

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

export const generateReplaceAccountTargetsTxRequest = async (
  creator: Identity,
  domain: string,
  name: string,
  newTargets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateReplaceAccountTargetsTxWithFee(creator, domain, name, newTargets);

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
