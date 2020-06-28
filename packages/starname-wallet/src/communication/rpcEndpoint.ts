import { Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";

/**
 * The response of a successful "getIdentities" RPC call to an endpoint.
 *
 * @see https://github.com/iov-one/iov-core/blob/v0.17.2/docs/out-of-process-rpc.md#methods
 */
export type GetIdentitiesResponse = readonly Identity[];

/**
 * The response of a successful "signAndPost" RPC call to an endpoint.
 *
 * @see https://github.com/iov-one/iov-core/blob/v0.17.2/docs/out-of-process-rpc.md#methods
 */
export type SignAndPostResponse = TransactionId | null;

export type RpcEndpointType = "ledger" | "extension";

export interface RpcEndpoint {
  readonly authorizeGetIdentitiesMessage: string;
  readonly authorizeSignAndPostMessage: string;
  readonly notAvailableMessage: string;
  readonly noMatchingIdentityMessage: string;
  readonly type: RpcEndpointType;

  /**
   * @returns a response or `undefined` if the endpoint was not available
   */
  readonly sendGetIdentitiesRequest: (request: JsonRpcRequest) => Promise<GetIdentitiesResponse | undefined>;
  /**
   * @returns a response or `undefined` if the endpoint was not available
   */
  readonly sendSignAndPostRequest: (request: JsonRpcRequest) => Promise<SignAndPostResponse | undefined>;
}
