import {
  Algorithm,
  ChainId,
  FullSignature,
  Identity,
  isBlockInfoPending,
  PubkeyBytes,
  SignatureBytes,
  SignedTransaction,
  TransactionId,
} from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { isJsonCompatibleDictionary, TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { IovLedgerApp, isLedgerAppAddress, isLedgerAppSignature, isLedgerAppVersion } from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { getConfig } from "../config";
import { getConnectionForBns } from "../logic/connection";
import { GetIdentitiesResponse, RpcEndpoint } from "./rpcEndpoint";

const addressIndex = 0; // Leads to path m/44'/234'/0'

export const ledgerRpcEndpoint: RpcEndpoint = {
  sendGetIdentitiesRequest: async (request: JsonRpcRequest): Promise<GetIdentitiesResponse> => {
    let transport: TransportWebUSB;
    try {
      transport = await TransportWebUSB.create(5000);
    } catch (error) {
      console.warn(error);
      return undefined;
    }

    const app = new IovLedgerApp(transport);
    const version = await app.getVersion();
    if (!isLedgerAppVersion(version)) throw new Error(version.errorMessage);
    const response = await app.getAddress(addressIndex);
    if (!isLedgerAppAddress(response)) throw new Error(response.errorMessage);

    const ledgerChainIds = (await getConfig()).ledger.chainIds;

    const bnsIdentity: Identity = {
      chainId: (version.testMode ? ledgerChainIds.testnetBuild : ledgerChainIds.mainnetBuild) as ChainId,
      pubkey: {
        algo: Algorithm.Ed25519,
        data: response.pubkey as PubkeyBytes,
      },
    };

    let out: readonly Identity[];

    if (
      request.method === "getIdentities" &&
      isJsonCompatibleDictionary(request.params) &&
      Array.isArray(request.params.chainIds) &&
      TransactionEncoder.fromJson(request.params.chainIds).includes(bnsIdentity.chainId)
    ) {
      out = [bnsIdentity];
    } else {
      out = [];
    }

    await transport.close();
    return out;
  },
  sendSignAndPostRequest: async (request: JsonRpcRequest): Promise<TransactionId | null> => {
    if (request.method !== "signAndPost" || !isJsonCompatibleDictionary(request.params)) {
      throw new Error("Unsupported request format");
    }

    const transaction = TransactionEncoder.fromJson(request.params.transaction);

    const bnsConnection = await getConnectionForBns();
    const nonce = await bnsConnection.getNonce({ pubkey: transaction.creator.pubkey });
    const { bytes } = bnsCodec.bytesToSign(transaction, nonce);

    const transport = await TransportWebUSB.create(5000);

    const app = new IovLedgerApp(transport);
    const versionResponse = await app.getVersion();
    if (!isLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
    const addressResponse = await app.getAddress(addressIndex);
    if (!isLedgerAppAddress(addressResponse)) throw new Error(addressResponse.errorMessage);
    const signatureResponse = await app.sign(addressIndex, bytes);
    if (!isLedgerAppSignature(signatureResponse)) throw new Error(signatureResponse.errorMessage);

    await transport.close();

    const signature: FullSignature = {
      pubkey: transaction.creator.pubkey,
      nonce: nonce,
      signature: signatureResponse.signature as SignatureBytes,
    };

    const signedTransaction: SignedTransaction = {
      transaction: transaction,
      primarySignature: signature,
      otherSignatures: [],
    };

    const transactionId = bnsCodec.identifier(signedTransaction);

    const response = await bnsConnection.postTx(bnsCodec.bytesToPost(signedTransaction));
    await response.blockInfo.waitFor(info => !isBlockInfoPending(info));

    return transactionId;
  },
};
