import "regenerator-runtime"; // required by @ledgerhq/hw-transport-webusb

import {
  Algorithm,
  ChainId,
  FullSignature,
  Identity,
  isIdentity,
  isUnsignedTransaction,
  PubkeyBytes,
  SignatureBytes,
  SignedTransaction,
} from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { isJsonCompatibleDictionary, TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest } from "@iov/jsonrpc";
import {
  IovLedgerApp,
  isIovLedgerAppAddress,
  isIovLedgerAppSignature,
  isIovLedgerAppVersion,
} from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { fromHex } from "@cosmjs/encoding";
import { Secp256k1 } from "@cosmjs/crypto";

import { getConnectionForBns } from "../logic/connection";
import { GetIdentitiesResponse, RpcEndpoint, SignAndPostResponse } from "./rpcEndpoint";

const addressIndex = 0; // Leads to path m/44'/234'/0'

function isArrayOfString(data: unknown): data is readonly string[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(element => typeof element === "string");
}

export const ledgerRpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "Waiting for Ledger device to provide identity...",
  authorizeSignAndPostMessage: "Please sign transaction on Ledger device to continue.",
  notAvailableMessage: "Please connect your Ledger Nano S, open the IOV app and try again.",
  noMatchingIdentityMessage: "No matching identity found. Did you open the correct app?",
  type: "ledger",

  sendGetIdentitiesRequest: async (request: JsonRpcRequest): Promise<GetIdentitiesResponse | undefined> => {
    if (
      request.method !== "getIdentities" ||
      !isJsonCompatibleDictionary(request.params) ||
      !isArrayOfString(request.params.chainIds)
    ) {
      throw new Error(
        "Unsupported request format. Since this request was created by the same application, this is a bug.",
      );
    }

    /*

    try {
      transport = await TransportWebUSB.create(5000);
      const app = new IovLedgerApp(transport);

      // Check if correct app is open. This also works with auto-locked Ledger.
      const version = await app.getVersion();
      if (!isIovLedgerAppVersion(version)) throw new Error(version.errorMessage);
      testnetApp = version.testMode;

      // Get address/pubkey. This requires unlocked Ledger.
      const response = await app.getAddress(addressIndex);
      if (!isIovLedgerAppAddress(response)) throw new Error(response.errorMessage);
      addressResponse = response;
    } catch (error) {
      console.info("Could not get address from Ledger. Full error details:", error);
      return undefined;
    } finally {
      if (transport) await transport.close();
    }
    
    const ledgerChainIds = (await getConfig()).ledger.chainIds;

    */

    const privkey = fromHex("5b1d5975dfdfb0027802265241d891e4af744cd39e78595658afaa7ac801d1d3");
    const keypair = await Secp256k1.makeKeypair(privkey);

    const bnsIdentity: Identity = {
      chainId: "iovns-galaxynet" as ChainId,
      pubkey: {
        algo: Algorithm.Secp256k1,
        data: keypair.pubkey as PubkeyBytes,
      },
    };

    let out: readonly Identity[];

    if (TransactionEncoder.fromJson(request.params.chainIds).includes(bnsIdentity.chainId)) {
      out = [bnsIdentity];
    } else {
      out = [];
    }

    return out;
  },
  sendSignAndPostRequest: async (request: JsonRpcRequest): Promise<SignAndPostResponse | undefined> => {
    if (request.method !== "signAndPost" || !isJsonCompatibleDictionary(request.params)) {
      throw new Error(
        "Unsupported request format. Since this request was created by the same application, this is a bug.",
      );
    }

    const signer = TransactionEncoder.fromJson(request.params.signer);
    if (!isIdentity(signer)) {
      throw new Error("Invalid signer format in RPC request to Ledger endpoint.");
    }

    const transaction = TransactionEncoder.fromJson(request.params.transaction);
    if (!isUnsignedTransaction(transaction)) {
      throw new Error("Invalid transaction format in RPC request to Ledger endpoint.");
    }

    const bnsConnection = await getConnectionForBns();
    const nonce = await bnsConnection.getNonce({ pubkey: signer.pubkey });
    const { bytes } = bnsCodec.bytesToSign(transaction, nonce);

    let transport: TransportWebUSB;
    try {
      transport = await TransportWebUSB.create(5000);
    } catch (error) {
      console.warn(error);
      return undefined;
    }

    const app = new IovLedgerApp(transport);
    const versionResponse = await app.getVersion();
    if (!isIovLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
    const addressResponse = await app.getAddress(addressIndex);
    if (!isIovLedgerAppAddress(addressResponse)) throw new Error(addressResponse.errorMessage);
    if (addressResponse.address !== bnsCodec.identityToAddress(signer)) {
      throw new Error("Address response does not match expected signer");
    }
    const signatureResponse = await app.sign(addressIndex, bytes);
    if (!isIovLedgerAppSignature(signatureResponse)) throw new Error(signatureResponse.errorMessage);

    await transport.close();

    const signature: FullSignature = {
      pubkey: signer.pubkey,
      nonce: nonce,
      signature: signatureResponse.signature as SignatureBytes,
    };

    const signedTransaction: SignedTransaction = {
      transaction: transaction,
      signatures: [signature],
    };

    const transactionId = bnsCodec.identifier(signedTransaction);

    await bnsConnection.postTx(bnsCodec.bytesToPost(signedTransaction));

    return transactionId;
  },
};
