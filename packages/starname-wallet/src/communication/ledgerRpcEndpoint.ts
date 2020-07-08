import { toBase64 } from "@cosmjs/encoding";
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
import {
  IovLedgerApp,
  IovLedgerAppAddress,
  isIovLedgerAppAddress,
  isIovLedgerAppSignature,
  isIovLedgerAppVersion,
} from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { getConfig } from "../config";
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
  notAvailableMessage:
    "Please connect your Ledger, open the IOV app and try again. See the console for more info.",
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
    let transport: TransportWebUSB | undefined;
    let testnetApp: boolean;
    let addressResponse: IovLedgerAppAddress;

    try {
      transport = await TransportWebUSB.create(5000);
      const ledger = new IovLedgerApp(transport);

      // Check if correct app is open. This also works with auto-locked Ledger.
      const version = await ledger.getVersion(); // throws on error
      if (!isIovLedgerAppVersion(version)) throw new Error(version.errorMessage);
      testnetApp = version.testMode;

      // Get address/pubkey. This requires unlocked Ledger.
      const response = await ledger.getAddress(addressIndex);
      if (!isIovLedgerAppAddress(response)) throw new Error(response.errorMessage);
      addressResponse = response;
    } catch (error) {
      console.info("Could not get address from Ledger. Full error details:", error);
      return undefined;
    } finally {
      if (transport) await transport.close();
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

    let transport: TransportWebUSB;
    try {
      transport = await TransportWebUSB.create(5000);
    } catch (error) {
      console.warn(error);
      return undefined;
    }
    const config = await getConfig();
    const ledger = new IovLedgerApp(transport);
    const version = await ledger.getVersion(); // throws on error
    if (!isIovLedgerAppVersion(version)) throw new Error(version.errorMessage);
    const addressResponse = await ledger.getAddress(addressIndex);
    if (!isIovLedgerAppAddress(addressResponse)) throw new Error(addressResponse.errorMessage);
    // The following check fails because it assumes a ED25519 key, which was used by weave.
    // if (addressResponse.address !== bnsCodec.identityToAddress(signer)) {
    //   throw new Error("Address response does not match expected signer.");
    // }

    // Quick and dirty send via the REST API instead of an IOVNS connection.
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

    const got = await fetch(`${chain.chainSpec.node}/auth/accounts/${addressResponse.address}`); // HARD-CODED
    const account: any = await got.json();
    const unsigned: any = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_number: String(account.result.value.account_number),
      sequence: String(account.result.value.sequence),
      // eslint-disable-next-line @typescript-eslint/camelcase
      chain_id: chain.chainSpec.chainId.split(":")[1], // HARD-CODED: chain_id must match the genesis file
      fee: {
        amount: [
          {
            amount: "2000000", // HARD-CODED; gas * 10.0uiov
            denom: coin.denom,
          },
        ],
        gas: "200000", // HARD-CODED
      },
      msgs: [
        {
          type: "cosmos-sdk/MsgSend",
          value: {
            amount: [
              {
                amount: transaction.amount.quantity,
                denom: coin.denom,
              },
            ],
            // eslint-disable-next-line @typescript-eslint/camelcase
            from_address: addressResponse.address,
            // eslint-disable-next-line @typescript-eslint/camelcase
            to_address: transaction.recipient,
          },
        },
      ],
      memo: transaction.memo || "",
    };
    const sorted: any = {};
    Object.keys(unsigned)
      .sort()
      .forEach((key: string) => {
        sorted[key] = unsigned[key];
      });
    const signature = await ledger.sign(addressIndex, JSON.stringify(sorted));
    if (!isIovLedgerAppSignature(signature)) throw new Error(signature.errorMessage);

    await transport.close();

    sorted["msg"] = sorted.msgs; // Ledger needs msgs, API needs msg
    delete sorted.msgs;

    const signed = Object.assign({}, sorted, {
      signatures: [
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          account_number: String(account.result.value.account_number),
          sequence: String(account.result.value.sequence),
          // eslint-disable-next-line @typescript-eslint/camelcase
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: toBase64(addressResponse.pubkey),
          },
          signature: toBase64(signature.signature),
        },
      ],
    });
    const broadcastable = { tx: signed, mode: "block" }; // HARD-CODED mode
    const body = JSON.stringify(broadcastable);
    const fetched = await fetch(`${chain.chainSpec.node}/txs`, { method: "POST", body: body }); // HARD-CODED
    const response = await fetched.json();

    return response.txhash;
  },
};
