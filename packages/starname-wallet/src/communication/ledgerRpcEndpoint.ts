import {
  IovLedgerApp,
  IovLedgerAppAddress,
  IovLedgerAppErrorState,
  isIovLedgerAppAddress,
} from "@iov/ledger-iovns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Account, Api, Coin, Transaction } from "logic/api";
import { Task } from "logic/http";

import { RpcEndpoint } from "./rpcEndpoint";

const NotInitializedError: Error = new Error("sorry, ledger device not initialized");

/* async function getLedgerAddress(ledger: Ledger): Promise<Record<string, any>> {
  const pubkey = await ledger.getPubKey(); // throws on error
  const address = await ledger.getIovAddress(); // throws on error
  const addressResponse = {
    address: address,
    errorMessage: "No errors", // HARD-CODED in conjunction with ledger.getPubKey()
    pubkey: pubkey,
    returnCode: 36864, // HARD-CODED in conjunction with ledger.getPubKey()
  };
  return addressResponse;
}*/
/* import { toBase64 } from "@cosmjs/encoding";
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
} from "@iov/ledger-iovns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { signatureImport } from "secp256k1";

import { getConfig } from "../config";
import { GetIdentitiesResponse, RpcEndpoint, SignAndPostResponse } from "./rpcEndpoint";

const addressIndex = 0; // Leads to path m/44'/234'/0'

function isArrayOfString(data: unknown): data is readonly string[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(element => typeof element === "string");
}*/

class LedgerRpcEndpoint implements RpcEndpoint {
  private ledger: IovLedgerApp | null = null;
  private iovLedgerAddress: IovLedgerAppAddress | null = null;

  public authorizeGetIdentitiesMessage = "Waiting for Ledger device to provide identity...";
  public authorizeSignAndPostMessage = "Please sign transaction on Ledger device to continue.";
  public notAvailableMessage =
    "Please connect your Ledger, open the IOV app and try again. See the console for more info.";
  public noMatchingIdentityMessage = "No matching identity found. Did you open the correct app?";
  public type: "ledger" | "extension" = "ledger";

  public resolveStarname = (query: string): Task<Account> => {
    return Api.resolveStarname(query);
  };
  public executeRequest = async (request: any): Promise<string | undefined> => {
    return undefined;
  };
  public start = async (): Promise<boolean> => {
    const transport: TransportWebUSB = await TransportWebUSB.create(5000);
    const ledger: IovLedgerApp = new IovLedgerApp(transport);
    const result: IovLedgerAppAddress | IovLedgerAppErrorState = await ledger.getAddress(0);
    if (isIovLedgerAppAddress(result)) {
      this.iovLedgerAddress = result;
      this.ledger = ledger;
    } else {
      throw new Error(result.errorMessage);
    }
    return true;
  };

  public getBalances = async (): Promise<Coin[]> => {
    if (this.iovLedgerAddress === null) throw NotInitializedError;
    const { address } = this.iovLedgerAddress;
    return Api.getBalance(address);
  };

  public getTransactions = async (): Promise<Transaction[]> => {
    if (this.iovLedgerAddress === null) throw NotInitializedError;
    const { address } = this.iovLedgerAddress;
    return Api.getTransactions(address);
  };
}

export const ledgerRpcEndpoint = new LedgerRpcEndpoint();
