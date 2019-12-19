import { Identity, UnsignedTransaction } from "@iov/bcp";
import { JsonRpcResponse } from "@iov/jsonrpc";
import { MultiChainSigner } from "@iov/multichain";

import { generateErrorResponse } from "../../errorResponseGenerator";
import { AuthorizationCallbacks, isSupportedTransaction, UseOnlyJsonRpcSigningServer } from "../persona";
import { getChainName } from "../persona/config";
import { requestCallback } from "./requestCallback";
import {
  GetIdentitiesResponseData,
  isRequestMeta,
  Request,
  RequestMeta,
  RequestQueueManager,
  SignAndPostResponseData,
  UiIdentity,
} from "./requestQueueManager";
import { SenderWhitelist } from "./senderWhitelist";

// From https://www.jsonrpc.org/specification#error_object
// -32000 to -32099 	Server error 	Reserved for implementation-defined server-errors.
// We use -3200 as jsonRpcCode.serverError.default
const errorCodes = {
  signingServerNotReady: -32010,
  senderUrlMissing: -32011,
  senderBlocked: -32012,
};

export default class RequestsHandler {
  private queueManager = new RequestQueueManager();
  private senderWhitelist = new SenderWhitelist();
  private signingServer: UseOnlyJsonRpcSigningServer | undefined;

  public makeAuthorizationCallbacks(signer: MultiChainSigner): AuthorizationCallbacks {
    return {
      authorizeGetIdentities: async (reason: string, matchingIdentities: readonly Identity[], meta: any) => {
        if (!isRequestMeta(meta)) {
          throw new Error("Unexpected type of data in meta field");
        }

        const requestedIdentities = await Promise.all(
          matchingIdentities.map(
            async (matchedIdentity): Promise<UiIdentity> => {
              return {
                chainName: await getChainName(matchedIdentity.chainId),
                address: signer.identityToAddress(matchedIdentity),
              };
            },
          ),
        );

        const data: GetIdentitiesResponseData = { requestedIdentities };

        return requestCallback(
          this.queueManager,
          this.senderWhitelist,
          meta.senderUrl,
          reason,
          data,
          matchingIdentities,
          [],
        );
      },
      authorizeSignAndPost: (
        reason: string,
        signer: Identity,
        transaction: UnsignedTransaction,
        meta: any,
      ): Promise<boolean> => {
        if (!isRequestMeta(meta)) {
          throw new Error("Unexpected type of data in meta field");
        }

        if (!isSupportedTransaction(transaction)) {
          throw new Error("Unexpected unsigned transaction");
        }

        const data: SignAndPostResponseData = { tx: transaction };
        return requestCallback(
          this.queueManager,
          this.senderWhitelist,
          meta.senderUrl,
          reason,
          data,
          true,
          false,
        );
      },
    };
  }

  public getPendingRequests(): readonly Request[] {
    return this.queueManager.requests();
  }

  public start(signingServer: UseOnlyJsonRpcSigningServer): void {
    this.queueManager = new RequestQueueManager();
    this.senderWhitelist = new SenderWhitelist();
    this.signingServer = signingServer;
  }

  public shutdown(): void {
    if (!this.signingServer) {
      throw new Error("The signing server instance is not set. This indicates a bug in the lifecycle.");
    }
    this.signingServer = undefined;
  }

  public async handleRequestMessage(
    request: any,
    sender: chrome.runtime.MessageSender,
  ): Promise<JsonRpcResponse> {
    const responseId = typeof request.id === "number" ? request.id : null;

    if (!this.signingServer) {
      return generateErrorResponse(responseId, "Signing server not ready", errorCodes.signingServerNotReady);
    }

    if (!sender.url) {
      return generateErrorResponse(
        responseId,
        "Got external message without sender URL",
        errorCodes.senderUrlMissing,
      );
    }

    if (this.senderWhitelist.isBlocked(sender.url)) {
      return generateErrorResponse(responseId, "Sender has been blocked by user", errorCodes.senderBlocked);
    }

    const meta: RequestMeta = {
      senderUrl: sender.url,
    };

    const response = await this.signingServer.handleUnchecked(request, meta);
    return response;
  }
}
