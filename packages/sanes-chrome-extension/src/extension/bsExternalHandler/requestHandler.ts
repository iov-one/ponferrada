import { JsonRpcRequest } from '@iov/jsonrpc';

interface Request {
  readonly request: JsonRpcRequest;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export function parseMethod(method: string): void {
  const allowed = method === 'getIdentities' || method === 'signAndPost';

  if (!allowed) {
    throw new Error('Request method not allowed, use getIdentities or signAndPost');
  }
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
