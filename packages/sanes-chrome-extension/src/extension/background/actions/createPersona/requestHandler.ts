import { Omit } from '@material-ui/core';

export interface Request {
  readonly id: number;
  readonly type: 'getIdentities' | 'signAndPost';
  readonly reason: string;
  readonly sender: string;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export class RequestHandler {
  private static instance: Request[] = [];
  private static counter = 0;

  public static load(): void {
    RequestHandler.instance = [];
    RequestHandler.counter = 0;
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

  // TODO use Omit included in TS when upgrade to 3.5
  public static add(req: Omit<Request, 'id'>): number {
    const size = RequestHandler.instance.push({ ...req, id: RequestHandler.counter });
    RequestHandler.counter = RequestHandler.counter + 1;

    return size;
  }
}
