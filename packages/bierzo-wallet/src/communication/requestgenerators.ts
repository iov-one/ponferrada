import { Address, Amount, Identity, SendTransaction, UnsignedTransaction } from "@iov/bcp";
import {
  bnsCodec,
  ChainAddressPair,
  DeleteAccountTx,
  DeleteDomainTx,
  RegisterAccountTx,
  RegisterDomainTx,
  RenewAccountTx,
  RenewDomainTx,
  ReplaceAccountTargetsTx,
  TransferAccountTx,
  TransferDomainTx,
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

export const generateRenewDomainTxWithFee = async (
  creator: Identity,
  domain: string,
): Promise<RenewDomainTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);

  const transaction: RenewDomainTx = {
    kind: "bns/renew_domain",
    chainId: creator.chainId,
    domain: domain,
  };

  return await withChainFee(transaction, creatorAddress);
};

export const generateRenewAccountTxWithFee = async (
  creator: Identity,
  name: string,
  domain: string,
): Promise<RenewAccountTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);

  const transaction: RenewAccountTx = {
    kind: "bns/renew_account",
    chainId: creator.chainId,
    name: name,
    domain: domain,
  };

  return await withChainFee(transaction, creatorAddress);
};

export const generateDeleteDomainTxWithFee = async (
  creator: Identity,
  domain: string,
): Promise<DeleteDomainTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);

  const transaction: DeleteDomainTx = {
    kind: "bns/delete_domain",
    chainId: creator.chainId,
    domain: domain,
  };

  return await withChainFee(transaction, creatorAddress);
};

export const generateDeleteAccountTxWithFee = async (
  creator: Identity,
  name: string,
  domain: string,
): Promise<DeleteAccountTx> => {
  const creatorAddress = bnsCodec.identityToAddress(creator);

  const transaction: DeleteAccountTx = {
    kind: "bns/delete_account",
    chainId: creator.chainId,
    name: name,
    domain: domain,
  };

  return await withChainFee(transaction, creatorAddress);
};

export const generateRegisterAccountTxWithFee = async (
  creator: Identity,
  name: string,
  domain: string,
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

export const generateTransferAccountTxWithFee = async (
  creator: Identity,
  name: string,
  domain: string,
  newOwner: Address,
): Promise<TransferAccountTx> => {
  const transferAccountTx: TransferAccountTx = {
    kind: "bns/transfer_account",
    chainId: creator.chainId,
    name,
    domain,
    newOwner,
  };

  return withChainFee(transferAccountTx, bnsCodec.identityToAddress(creator));
};

export const generateReplaceAccountTargetsTxWithFee = async (
  creator: Identity,
  name: string,
  domain: string,
  newTargets: readonly ChainAddressPair[],
): Promise<ReplaceAccountTargetsTx> => {
  const regAccountTx: ReplaceAccountTargetsTx = {
    kind: "bns/replace_account_targets",
    chainId: creator.chainId,
    name: name ? name : undefined,
    domain: domain,
    newTargets: newTargets,
  };

  return await withChainFee(regAccountTx, bnsCodec.identityToAddress(creator));
};

function generateJsonPrcRequest<TValue>(creator: Identity, transactionWithFee: TValue): JsonRpcRequest {
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
}

export const generateRegisterDomainTxRequest = async (
  creator: Identity,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRegisterDomainTxWithFee(creator, domain);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateTransferDomainTxRequest = async (
  creator: Identity,
  domain: string,
  newOwner: Address,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateTransferDomainTxWithFee(creator, domain, newOwner);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateTransferAccountTxRequest = async (
  creator: Identity,
  name: string,
  domain: string,
  newOwner: Address,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateTransferAccountTxWithFee(creator, name, domain, newOwner);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateRenewDomainTxRequest = async (
  creator: Identity,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRenewDomainTxWithFee(creator, domain);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateRenewAccountTxRequest = async (
  creator: Identity,
  name: string,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRenewAccountTxWithFee(creator, name, domain);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateDeleteDomainTxRequest = async (
  creator: Identity,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateDeleteDomainTxWithFee(creator, domain);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateDeleteAccountTxRequest = async (
  creator: Identity,
  name: string,
  domain: string,
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateDeleteAccountTxWithFee(creator, name, domain);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateRegisterAccountTxRequest = async (
  creator: Identity,
  name: string,
  domain: string,
  owner: Address,
  targets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateRegisterAccountTxWithFee(creator, name, domain, owner, targets);

  return generateJsonPrcRequest(creator, transactionWithFee);
};

export const generateReplaceAccountTargetsTxRequest = async (
  creator: Identity,
  name: string,
  domain: string,
  newTargets: readonly ChainAddressPair[],
): Promise<JsonRpcRequest> => {
  const transactionWithFee = await generateReplaceAccountTargetsTxWithFee(creator, name, domain, newTargets);

  return generateJsonPrcRequest(creator, transactionWithFee);
};
