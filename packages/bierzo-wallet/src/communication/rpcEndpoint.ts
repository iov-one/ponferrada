import { Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";

/**
 * The response of a "getIdentities" RPC call to an endpoint.
 * `undefined` represents the case that the website could not connect to the
 * endpoint, i.e. the endpoint is not available.
 */
export type GetIdentitiesResponse = readonly Identity[] | undefined;

export interface RpcEndpoint {
  readonly sendGetIdentitiesRequest: (request: JsonRpcRequest) => Promise<GetIdentitiesResponse>;
  readonly sendSignAndPostRequest: (request: JsonRpcRequest) => Promise<TransactionId | null>;
}
