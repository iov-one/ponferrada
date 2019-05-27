import { Address, PublicIdentity, UnsignedTransaction } from '@iov/bcp';
import { JsonRpcSigningServer, SigningServerCore } from '@iov/core';
import { JsonRpcRequest, JsonRpcResponse } from '@iov/jsonrpc';
import { ChainNames } from '../persona/config';
import { requestCallback } from './requestCallback';
import {
  GetIdentitiesRequest,
  isRequestMeta,
  Request,
  RequestHandler,
  SignAndPostRequest,
} from './requestHandler';
import { SenderWhitelist } from './senderWhitelist';

/** Like JsonRpcSigningServer but without functionality to create or shutdown */
export interface UseOnlyJsonRpcSigningServer {
  /**
   * Handles a request from a possibly untrusted source.
   *
   * 1. Parse request as a JSON-RPC request
   * 2. Convert JSON-RPC request into calls to SigningServerCore
   * 3. Call SigningServerCore
   * 4. Convert result to JSON-RPC response
   *
   * @param request The JSON-RPC request to be handled
   * @param meta An arbitrary object that is passed by reference into the autorization callbacks
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUnchecked(request: unknown, meta?: any): Promise<JsonRpcResponse>;
  /**
   * Handles a checked request, i.e. a request that is known to be a valid
   * JSON-RPC "Request object".
   *
   * 1. Convert JSON-RPC request into calls to SigningServerCore
   * 2. Call SigningServerCore
   * 3. Convert result to JSON-RPC response
   *
   * @param request The JSON-RPC request to be handled
   * @param meta An arbitrary object that is passed by reference into the autorization callbacks
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChecked(request: JsonRpcRequest, meta?: any): Promise<JsonRpcResponse>;
}

export class SigningServer {
  private requestHandler = new RequestHandler();
  private senderWhitelist = new SenderWhitelist();
  private signingServer: JsonRpcSigningServer | undefined;

  public getIdentitiesCallback = (
    chainNames: ChainNames,
    addressMapper: (id: PublicIdentity) => Address,
  ) => async (
    reason: string,
    matchingIdentities: ReadonlyArray<PublicIdentity>,
    meta: any, // eslint-disable-line
  ) => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }
    const { senderUrl } = meta;

    const requestedIdentities = matchingIdentities.map(matchedIdentity => {
      const chainName = chainNames[matchedIdentity.chainId];

      return {
        name: chainName,
        address: addressMapper(matchedIdentity),
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
    this.signingServer = new JsonRpcSigningServer(core);
  }

  public shutdown(): void {
    if (!this.signingServer) {
      throw new Error('The signing server instance is not set. This indicates a bug in the lifecycle.');
    }
    this.signingServer.shutdown();
    this.signingServer = undefined;
  }
}
