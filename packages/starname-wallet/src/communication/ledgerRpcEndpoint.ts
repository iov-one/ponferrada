// dmjp import "regenerator-runtime"; // required by @ledgerhq/hw-transport-webusb

import { Algorithm, ChainId, Identity, isIdentity, isUnsignedTransaction, PubkeyBytes } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { isJsonCompatibleDictionary, TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest } from "@iov/jsonrpc";

import { getConfig } from "../config";
import { getConnectionForBns } from "../logic/connection";
import Ledger from "./ledger";
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

    const config = await getConfig();
    let testnetApp: boolean;
    let addressResponse: Record<string, any>;

    try {
      const ledger = new Ledger(
        { testModeAllowed: true },
        [44, 234, 0, 0, addressIndex], // HARD-CODED
        config.addressPrefix,
      );

      // Check if correct app is open. This also works with auto-locked Ledger.
      const version = await ledger.getIovAppVersion(); // throws on error
      testnetApp = version.test_mode;

      // Get address/pubkey. This requires unlocked Ledger.
      const pubkey = await ledger.getPubKey(); // throws on error
      const address = await ledger.getIovAddress(); // throws on error
      addressResponse = {
        address: address,
        errorMessage: "No errors", // HARD-CODED in conjunction with ledger.getPubKey()
        pubkey: pubkey,
        returnCode: 36864, // HARD-CODED in conjunction with ledger.getPubKey()
      };
    } catch (error) {
      console.info("Could not get address from Ledger. Full error details:", error);
      return undefined;
    }

    const ledgerChainIds = config.ledger.chainIds;

    const bnsIdentity: Identity = {
      chainId: (testnetApp ? ledgerChainIds.testnetBuild : ledgerChainIds.mainnetBuild) as ChainId,
      pubkey: {
        algo: Algorithm.Secp256k1,
        data: addressResponse.pubkey as PubkeyBytes,
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

    /*
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
    */
    return Promise.resolve(undefined); // dmjp
  },
};
