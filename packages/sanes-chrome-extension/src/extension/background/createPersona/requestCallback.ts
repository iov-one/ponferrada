/*global chrome*/
import { PublicIdentity, UnsignedTransaction } from '@iov/bcp';
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

function updateExtensionBadge(): void {
  const isExtensionContext = typeof chrome !== 'undefined'; // needed for tests
  if (!isExtensionContext) {
    return;
  }

  const queueSize = RequestHandler.requests().length;
  const badgeText = queueSize === 0 ? '' : `${queueSize}`;
  const iconPath = queueSize === 0 ? 'assets/icons/icon128.png' : 'assets/icons/request128.png';

  chrome.browserAction.setIcon({ path: iconPath });
  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
  chrome.browserAction.setBadgeText({ text: badgeText });
}

export async function getIdentitiesCallback(
  reason: string,
  matchingIdentities: ReadonlyArray<PublicIdentity>,
  meta: RequestMeta,
): Promise<ReadonlyArray<PublicIdentity>> {
  if (!isRequestMeta(meta)) {
    throw new Error('Unexpected type of data in meta field');
  }
  const { senderUrl } = meta;

  return new Promise(resolve => {
    const accept = (): void => {
      RequestHandler.solved();
      updateExtensionBadge();

      resolve(matchingIdentities);
    };

    const reject = (permanent: boolean): void => {
      if (permanent) {
        SenderWhitelist.block(senderUrl);
      }
      RequestHandler.solved();
      updateExtensionBadge();

      resolve([]);
    };

    RequestHandler.add({ reason, sender: meta.senderUrl, accept, reject });
    updateExtensionBadge();
  });
}

export async function signAndPostCallback(
  reason: string,
  _transaction: UnsignedTransaction,
  meta: RequestMeta,
): Promise<boolean> {
  if (!isRequestMeta(meta)) {
    throw new Error('Unexpected type of data in meta field');
  }

  const { senderUrl } = meta;

  return new Promise(resolve => {
    const accept = (): void => {
      RequestHandler.solved();
      updateExtensionBadge();

      resolve(true);
    };

    const reject = (permanent: boolean): void => {
      if (permanent) {
        SenderWhitelist.block(senderUrl);
      }
      RequestHandler.solved();
      updateExtensionBadge();

      resolve(false);
    };

    RequestHandler.add({ reason, sender: meta.senderUrl, accept, reject });
    updateExtensionBadge();
  });
}
