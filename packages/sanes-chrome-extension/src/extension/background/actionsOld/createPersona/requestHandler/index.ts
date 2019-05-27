import { Address } from '@iov/bcp';
import { Omit } from '@material-ui/core';

export interface RequestMeta {
  readonly senderUrl: string;
}

export interface GetIdentitiesData {
  name: string;
  address: Address;
}

export interface GetIdentitiesRequest extends RequestMeta {
  readonly requestedIdentities: ReadonlyArray<GetIdentitiesData>;
}

export function isGetIdentityData(data: unknown): data is GetIdentitiesRequest {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const hasSender = typeof (data as GetIdentitiesRequest).senderUrl === 'string';
  const identities = (data as GetIdentitiesRequest).requestedIdentities;
  const hasIdentities = Array.isArray(identities) && identities.every(item => typeof item.name === 'string');

  return hasIdentities && hasSender;
}

export interface SignAndPostRequest extends RequestMeta {
  readonly tx: any; // eslint-disable-line
}

export interface Request {
  readonly id: number;
  readonly type: 'getIdentities' | 'signAndPost';
  readonly reason: string;
  readonly data: GetIdentitiesRequest | SignAndPostRequest;
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

  public static purge(senderUrl: string): void {
    const initialSize = RequestHandler.instance.length;
    for (let i = 0; i < initialSize; i++) {
      const req = RequestHandler.instance[i];
      if (req.data.senderUrl !== senderUrl) {
        continue;
      }

      // Note here we are mutating the array placing in first positions request to be rejected
      RequestHandler.instance.splice(i, 1);
      RequestHandler.instance.splice(0, 0, req);
    }

    // Note here we only get references
    const reqToCancel = RequestHandler.instance.filter(req => req.data.senderUrl === senderUrl);
    reqToCancel.forEach(req => req.reject(false));
  }
}
