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

interface Request {
  readonly req: RpcCall;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export class RequestHandler {
  private static instance: Request[];

  public static create(): void {
    RequestHandler.instance = [];
  }

  public static get(): Request {
    if (!RequestHandler.instance) {
      throw new Error('There are no requests stored');
    }

    const req = RequestHandler.instance.shift();
    if (!req) {
      throw new Error('Shifted element is undefined');
    }

    return req;
  }

  public static add(req: Request): number {
    if (!RequestHandler.instance) {
      throw new Error('Request handler instance has not been initilised');
    }

    return RequestHandler.instance.unshift(req);
  }
}
