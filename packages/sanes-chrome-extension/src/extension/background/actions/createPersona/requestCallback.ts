import { PublicIdentity, UnsignedTransaction } from '@iov/bcp';
import { getCreatedPersona } from '.';
import { requestUpdater } from './requestAppUpdater';
import { updateExtensionBadge } from './requestExtensionBadge';
import { GetIdentitiesRequest, RequestHandler, RequestMeta, SignAndPostRequest } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRequestMeta(data: unknown): data is RequestMeta {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return typeof (data as RequestMeta).senderUrl === 'string';
}

async function requestCallback<T>(
  reason: string,
  type: 'getIdentities' | 'signAndPost',
  data: GetIdentitiesRequest | SignAndPostRequest,
  acceptResponse: T,
  rejectResponse: T,
): Promise<T> {
  return new Promise(resolve => {
    const accept = (): void => {
      RequestHandler.solved();
      updateExtensionBadge(RequestHandler.requests().length);
      requestUpdater();
      resolve(acceptResponse);
    };

    const reject = (permanent: boolean): void => {
      RequestHandler.solved();
      if (permanent) {
        SenderWhitelist.block(data.senderUrl);
        RequestHandler.purge(data.senderUrl);
      }
      updateExtensionBadge(RequestHandler.requests().length);
      requestUpdater();
      resolve(rejectResponse);
    };

    RequestHandler.add({ reason, type, data, accept, reject });
    updateExtensionBadge(RequestHandler.requests().length);
    requestUpdater();
  });
}

export async function getIdentitiesCallback(
  reason: string,
  matchingIdentities: ReadonlyArray<PublicIdentity>,
  meta: any, // eslint-disable-line
): Promise<ReadonlyArray<PublicIdentity>> {
  if (!isRequestMeta(meta)) {
    throw new Error('Unexpected type of data in meta field');
  }
  const { senderUrl } = meta;

  const persona = getCreatedPersona();
  const chainNames = persona.getChains();
  const requestedIdentities = matchingIdentities.map(matchedIdentity => {
    const chainName = chainNames[matchedIdentity.chainId];

    return {
      name: chainName,
      address: persona.getAddressFrom(matchedIdentity),
    };
  });

  const data: GetIdentitiesRequest = {
    senderUrl,
    requestedIdentities,
  };

  return requestCallback(reason, 'getIdentities', data, matchingIdentities, []);
}

export async function signAndPostCallback(
  reason: string,
  transaction: UnsignedTransaction,
  meta: any, // eslint-disable-line
): Promise<boolean> {
  if (!isRequestMeta(meta)) {
    throw new Error('Unexpected type of data in meta field');
  }
  const { senderUrl } = meta;

  const data: SignAndPostRequest = {
    senderUrl,
    tx: transaction,
  };

  return requestCallback(reason, 'signAndPost', data, true, false);
}
