import { PublicIdentity, UnsignedTransaction } from '@iov/bcp';
import { updateExtensionBadge } from './requestExtensionBadge';
import { RequestHandler } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

export interface RequestMeta {
  readonly senderUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRequestMeta(data: unknown): data is RequestMeta {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return typeof (data as RequestMeta).senderUrl === 'string';
}

async function requestCallback<T>(
  reason: string,
  meta: any, // eslint-disable-line
  acceptResponse: T,
  rejectResponse: T,
): Promise<T> {
  if (!isRequestMeta(meta)) {
    throw new Error('Unexpected type of data in meta field');
  }
  const { senderUrl } = meta;

  return new Promise(resolve => {
    const accept = (): void => {
      RequestHandler.solved();
      updateExtensionBadge(RequestHandler.requests().length);

      resolve(acceptResponse);
    };

    const reject = (permanent: boolean): void => {
      if (permanent) {
        SenderWhitelist.block(senderUrl);
      }
      RequestHandler.solved();
      updateExtensionBadge(RequestHandler.requests().length);

      resolve(rejectResponse);
    };

    RequestHandler.add({ reason, sender: senderUrl, accept, reject });
    updateExtensionBadge(RequestHandler.requests().length);
  });
}

export async function getIdentitiesCallback(
  reason: string,
  matchingIdentities: ReadonlyArray<PublicIdentity>,
  meta: any, // eslint-disable-line
): Promise<ReadonlyArray<PublicIdentity>> {
  return requestCallback(reason, meta, matchingIdentities, []);
}

export async function signAndPostCallback(
  reason: string,
  _transaction: UnsignedTransaction,
  meta: any, // eslint-disable-line
): Promise<boolean> {
  return requestCallback(reason, meta, true, false);
}
