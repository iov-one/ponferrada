import { ChainId, UnsignedTransaction } from '@iov/bcp';
import { JsonRpcRequest } from '@iov/jsonrpc';

// TODO remove when iov-core makes it available
export interface RpcCallGetIdentities {
  readonly name: 'getIdentities';
  readonly reason: string;
  readonly chainIds: ReadonlyArray<ChainId>;
}

// TODO remove when iov-core makes it available
export interface RpcCallSignAndPost {
  readonly name: 'signAndPost';
  readonly reason: string;
  readonly transaction: UnsignedTransaction;
}

// TODO remove when iov-core makes it available
export type RpcCall = RpcCallGetIdentities | RpcCallSignAndPost;

export function parseRpcCall(data: JsonRpcRequest): RpcCall {
  //eslint-disable-next-line
  return (data as any) as RpcCall;
}
