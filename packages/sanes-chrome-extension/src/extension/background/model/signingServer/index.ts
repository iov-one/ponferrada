import { isSendTransaction, PublicIdentity, UnsignedTransaction } from '@iov/bcp';
import { JsonRpcSigningServer, MultiChainSigner, SigningServerCore } from '@iov/core';
import { JsonRpcResponse } from '@iov/jsonrpc';
import { generateErrorResponse } from '../../errorResponseGenerator';
import { getConfigurationFile } from '../persona/config';
import { requestCallback } from './requestCallback';
import {
  GetIdentitiesRequest,
  isRequestMeta,
  Request,
  RequestMeta,
  RequestQueueManager,
  SignAndPostRequest,
} from './requestQueueManager';
import { SenderWhitelist } from './senderWhitelist';

export default class SigningServer {
  private requestHandler = new RequestQueueManager();
  private senderWhitelist = new SenderWhitelist();
  private signingServer: JsonRpcSigningServer | undefined;

  public getIdentitiesCallback = (signer: MultiChainSigner) => async (
    reason: string,
    matchingIdentities: ReadonlyArray<PublicIdentity>,
    meta: any, // eslint-disable-line
  ) => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }
    const { senderUrl } = meta;
    const chainNames = (await getConfigurationFile()).names;

    const requestedIdentities = matchingIdentities.map(matchedIdentity => {
      const chainName = chainNames[matchedIdentity.chainId];

      return {
        name: chainName,
        address: signer.identityToAddress(matchedIdentity),
      };
    });

    const data: GetIdentitiesRequest = {
      senderUrl,
      requestedIdentities,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'getIdentities',
      data,
      matchingIdentities,
      [],
    );
  };

  public signAndPostCallback = () => (
    reason: string,
    transaction: UnsignedTransaction,
    meta: any, // eslint-disable-line
  ): Promise<boolean> => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }

    if (!isSendTransaction(transaction)) {
      throw new Error('Unexted unsigned transaction');
    }

    const { senderUrl } = meta;

    const data: SignAndPostRequest = {
      senderUrl,
      tx: transaction,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'signAndPost',
      data,
      true,
      false,
    );
  };

  public getPendingRequests(): Request[] {
    return this.requestHandler.requests();
  }

  public start(core: SigningServerCore): void {
    this.requestHandler = new RequestQueueManager();
    this.senderWhitelist = new SenderWhitelist();
    this.signingServer = new JsonRpcSigningServer(core);
  }

  public shutdown(): void {
    if (!this.signingServer) {
      throw new Error('The signing server instance is not set. This indicates a bug in the lifecycle.');
    }
    this.signingServer.shutdown();
    this.signingServer = undefined;
  }

  public async handleRequestMessage(
    request: any, //eslint-disable-line
    sender: chrome.runtime.MessageSender,
  ): Promise<JsonRpcResponse> {
    const responseId = typeof request.id === 'number' ? request.id : null;
    if (!sender.url) {
      return generateErrorResponse(responseId, 'Got external message without sender URL');
    }

    if (!this.signingServer) {
      return generateErrorResponse(responseId, 'Signing server not ready');
    }

    const { url: senderUrl } = sender;
    if (this.senderWhitelist.isBlocked(senderUrl)) {
      return generateErrorResponse(responseId, 'Sender has been blocked by user');
    }

    const meta: RequestMeta = {
      senderUrl,
    };

    const response = await this.signingServer.handleUnchecked(request, meta);
    return response;
  }
}
