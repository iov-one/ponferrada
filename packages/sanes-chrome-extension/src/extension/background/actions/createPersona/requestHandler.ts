export interface Request {
  readonly type: 'getIdentities' | 'signAndPost';
  readonly reason: string;
  readonly sender: string;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export class RequestHandler {
  private static instance: Request[] = [];

  public static load(): void {
    RequestHandler.instance = [];
  }

  public static requests(): Request[] {
    return RequestHandler.instance;
  }

  public static next(): Request {
    const req = RequestHandler.instance[0];
    if (!req) {
      throw new Error('Next element is undefined');
    }

    return req;
  }

  public static solved(): void {
    if (RequestHandler.instance.length === 0) {
      throw new Error('There are no requests stored. This could lead to unexpected errors');
    }

    const req = RequestHandler.instance.shift();
    if (!req) {
      throw new Error('Shifted element is undefined. This could lead to unexpected errors');
    }
  }

  public static add(req: Request): number {
    return RequestHandler.instance.push(req);
  }
}
