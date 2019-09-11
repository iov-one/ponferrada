import { Identity, TransactionId } from "@iov/bcp";

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

export const communicationTexts = {
  authorizeGetIdentitiesMessage: "Please authorize request in Neuma to continue.",
  authorizeSignAndPostMessage: "Please authorize request in Neuma to continue.",
  notAvailableMessage: "You need to install the Neuma browser extension.",
  noMatchingIdentityMessage: "Please unlock Neuma to continue.",
};
