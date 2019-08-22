import { Address, isUnsignedTransaction } from "@iov/bcp";

import { isSupportedTransaction, SupportedTransaction } from "../../persona";

export interface RequestMeta {
  readonly senderUrl: string;
}

export function isRequestMeta(data: unknown): data is RequestMeta {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return typeof (data as RequestMeta).senderUrl === "string";
}

/**
 * A version of a BCP Identity made to be displayed in the UI.
 *
 * The BCP chain ID is represented as a human readable blockchain name
 * and the BCP public key is converted into a printable address.
 */
export interface UiIdentity {
  readonly chainName: string;
  readonly address: Address;
}

function isUiIdentity(data: unknown): data is UiIdentity {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return (
    typeof (data as UiIdentity).chainName === "string" && typeof (data as UiIdentity).address === "string"
  );
}

export interface GetIdentitiesResponseData {
  readonly requestedIdentities: readonly UiIdentity[];
}

export function isGetIdentitiesResponseData(data: unknown): data is GetIdentitiesResponseData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const identities = (data as GetIdentitiesResponseData).requestedIdentities;
  const hasIdentities = Array.isArray(identities) && identities.every(isUiIdentity);

  return hasIdentities;
}

export interface SignAndPostResponseData {
  readonly tx: SupportedTransaction;
}

export function isSignAndPostResponseData(data: unknown): data is SignAndPostResponseData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const tx: unknown = (data as SignAndPostResponseData).tx;
  const hasSupportedTransaction = isUnsignedTransaction(tx) && isSupportedTransaction(tx);

  return hasSupportedTransaction;
}

export interface Request<
  T extends GetIdentitiesResponseData | SignAndPostResponseData =
    | GetIdentitiesResponseData
    | SignAndPostResponseData
> {
  readonly id: number;
  readonly senderUrl: string;
  readonly reason: string;
  readonly responseData: T;
  readonly accept: () => void;
  readonly reject: (permanently: boolean) => void;
}

export function isGetIdentitiesRequest(request: Request): request is Request<GetIdentitiesResponseData> {
  return isGetIdentitiesResponseData(request.responseData);
}

export function isSignAndPostRequest(request: Request): request is Request<SignAndPostResponseData> {
  return isSignAndPostResponseData(request.responseData);
}

export class RequestQueueManager {
  private instance: Request[] = [];
  private counter = 0;

  public requests(): readonly Request[] {
    return this.instance;
  }

  public next(): Request {
    const firstRequest = this.instance.find(() => true);
    if (!firstRequest) {
      throw new Error("Next element is undefined");
    }

    return firstRequest;
  }

  public solved(): void {
    const req = this.instance.shift();
    if (!req) {
      throw new Error("Shifted element is undefined. This could lead to unexpected errors");
    }
  }

  public add(req: Omit<Request, "id">): number {
    const size = this.instance.push({ ...req, id: this.counter });
    this.counter = this.counter + 1;

    return size;
  }

  public purge(senderUrl: string): void {
    const initialSize = this.instance.length;
    for (let i = 0; i < initialSize; i++) {
      const req = this.instance[i];
      if (req.senderUrl !== senderUrl) {
        continue;
      }

      // Note here we are mutating the array placing in first positions request to be rejected
      this.instance.splice(i, 1);
      this.instance.splice(0, 0, req);
    }

    // Note here we only get references
    const reqToCancel = this.instance.filter(req => req.senderUrl === senderUrl);
    reqToCancel.forEach(req => req.reject(false));
  }
}
