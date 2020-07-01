import {
  Algorithm,
  ChainId,
  Identity,
  isIdentity,
  isUnsignedTransaction,
  PubkeyBytes,
  SendTransaction,
} from "@iov/bcp";
import { isJsonCompatibleDictionary, TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest } from "@iov/jsonrpc";
import Cosmos from "@lunie/cosmos-api";

import { getConfig } from "../config";
import Ledger from "./ledger";
import { GetIdentitiesResponse, RpcEndpoint, SignAndPostResponse } from "./rpcEndpoint";

function isArrayOfString(data: unknown): data is readonly string[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(element => typeof element === "string");
}

async function getLedgerAddress(ledger: Ledger): Promise<Record<string, any>> {
  const pubkey = await ledger.getPubKey(); // throws on error
  const address = await ledger.getIovAddress(); // throws on error
  const addressResponse = {
    address: address,
    errorMessage: "No errors", // HARD-CODED in conjunction with ledger.getPubKey()
    pubkey: pubkey,
    returnCode: 36864, // HARD-CODED in conjunction with ledger.getPubKey()
  };

  return addressResponse;
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
      const ledger = new Ledger({ testModeAllowed: true, hrp: config.addressPrefix });

      // Check if correct app is open. This also works with auto-locked Ledger.
      const version = await ledger.getIovAppVersion(); // throws on error
      testnetApp = version.test_mode;

      // Get address/pubkey. This requires unlocked Ledger.
      addressResponse = await getLedgerAddress(ledger);
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

    const transaction = TransactionEncoder.fromJson(request.params.transaction) as SendTransaction;
    if (!isUnsignedTransaction(transaction)) {
      throw new Error("Invalid transaction format in RPC request to Ledger endpoint.");
    }

    const config = await getConfig();
    const ledger = new Ledger({ testModeAllowed: true, hrp: config.addressPrefix });
    const addressResponse = await getLedgerAddress(ledger);
    // The following check fails because it assumes a ED25519 key, which was used by weave.
    // if (addressResponse.address !== bnsCodec.identityToAddress(signer)) {
    //   throw new Error("Address response does not match expected signer.");
    // }

    // Quick and dirty send via @lunie/cosmos-api instead of an IOVNS connection.
    // In other words, sendSignAndPostRequest() has gone from being able to sign and post
    // any transaction type to solely being able to handle a send tx.
    const chain = config.chains.find(chain => chain.chainSpec.chainId === signer.chainId);
    const coin = config.tokenConfiguration.bankTokens.find(
      token => token.ticker === transaction.amount.tokenTicker,
    );

    if (!chain) {
      throw new Error(`Couldn't find chain ${signer.chainId} in config.chains.`);
    }
    if (!coin) {
      throw new Error(
        `Couldn't find ticker ${transaction.amount.tokenTicker} in config.tokenConfiguration.bankTokens..`,
      );
    }

    // create the send message
    const message = {
      type: "cosmos-sdk/StdTx",
      value: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        from_address: addressResponse.address,
        // eslint-disable-next-line @typescript-eslint/camelcase
        to_address: transaction.recipient,
        amount: [{ denom: coin.denom, amount: transaction.amount.quantity }],
      },
    };
    // create a signer
    const ledgerSigner = async (signMessage: string): Promise<any> => {
      const publicKey = await ledger.getPubKey();
      const signature = await ledger.sign(signMessage);

      return {
        signature,
        publicKey,
      };
    };
    const cosmos = new Cosmos(chain.chainSpec.node, addressResponse.address);
    const { included } = await cosmos.send(
      addressResponse.address,
      {
        gas: 200000, // HARD-CODED
        gasPrices: [{ amount: "10.0", denom: coin.denom }], // HARD-CODED amount
        memo: transaction.memo,
      },
      [message],
      ledgerSigner,
    );
    const transactionId = await included();

    return transactionId;
  },
};
