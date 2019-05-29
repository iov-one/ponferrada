import { Address, isSendTransaction, SendTransaction } from '@iov/bcp';
import { Omit } from '@material-ui/core';

export interface RequestMeta {
  readonly senderUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRequestMeta(data: unknown): data is RequestMeta {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return typeof (data as RequestMeta).senderUrl === 'string';
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
  readonly tx: SendTransaction;
}

export function isSingAndPostRequestData(data: unknown): data is SignAndPostRequest {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const hasSender = typeof (data as SignAndPostRequest).senderUrl === 'string';
  const tx = (data as SignAndPostRequest).tx;

  return hasSender && isSendTransaction(tx);
}

export interface Request {
  readonly id: number;
  readonly type: 'getIdentities' | 'signAndPost';
  readonly reason: string;
  readonly data: GetIdentitiesRequest | SignAndPostRequest;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export class RequestQueueManager {
  private instance: Request[] = [];
  private counter = 0;

  public reset(): void {
    this.instance = [];
    this.counter = 0;
  }

  public requests(): Request[] {
    return this.instance;
  }

  public next(): Request {
    const req = this.instance[0];
    if (!req) {
      throw new Error('Next element is undefined');
    }

    return req;
  }

  public solved(): void {
    if (this.instance.length === 0) {
      throw new Error('There are no requests stored. This could lead to unexpected errors');
    }

    const req = this.instance.shift();
    if (!req) {
      throw new Error('Shifted element is undefined. This could lead to unexpected errors');
    }
  }

  // TODO use Omit included in TS when upgrade to 3.5
  public add(req: Omit<Request, 'id'>): number {
    const size = this.instance.push({ ...req, id: this.counter });
    this.counter = this.counter + 1;

    return size;
  }

  public purge(senderUrl: string): void {
    const initialSize = this.instance.length;
    for (let i = 0; i < initialSize; i++) {
      const req = this.instance[i];
      if (req.data.senderUrl !== senderUrl) {
        continue;
      }

      // Note here we are mutating the array placing in first positions request to be rejected
      this.instance.splice(i, 1);
      this.instance.splice(0, 0, req);
    }

    // Note here we only get references
    const reqToCancel = this.instance.filter(req => req.data.senderUrl === senderUrl);
    reqToCancel.forEach(req => req.reject(false));
  }
}
