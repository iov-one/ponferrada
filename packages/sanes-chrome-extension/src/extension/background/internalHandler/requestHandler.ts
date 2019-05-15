interface Request {
  readonly reason: string;
  readonly sender: string;
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

  public static requests(): Request[] {
    if (!RequestHandler.instance) {
      throw new Error('There are no requests stored');
    }

    return RequestHandler.instance;
  }

  public static next(): Request {
    if (!RequestHandler.instance) {
      throw new Error('There are no requests stored');
    }

    const req = RequestHandler.instance[0];
    if (!req) {
      throw new Error('Next element is undefined');
    }

    return req;
  }

  public static solved(): void {
    if (!RequestHandler.instance) {
      throw new Error('There are no requests stored. This could lead to unexpected errors');
    }

    const req = RequestHandler.instance.shift();
    if (!req) {
      throw new Error('Shifted element is undefined. This could lead to unexpected errors');
    }
  }

  public static add(req: Request): number {
    if (!RequestHandler.instance) {
      throw new Error('Request handler instance has not been initilised');
    }

    return RequestHandler.instance.push(req);
  }
}
