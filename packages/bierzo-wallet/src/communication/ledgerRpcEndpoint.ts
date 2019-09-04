import { Algorithm, ChainId, Identity, PubkeyBytes, TransactionId } from "@iov/bcp";
import { isJsonCompatibleDictionary, TransactionEncoder } from "@iov/encoding";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { IovLedgerApp, isLedgerAppAddress, isLedgerAppVersion } from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { getConfig } from "../config";
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
    throw new Error("Not implemented");
  },
};
