import { updateRequestProvider } from '../../updaters/appUpdater';
import { updateExtensionBadge } from '../../updaters/extensionBadgeUpdater';
import { GetIdentitiesRequest, RequestHandler, SignAndPostRequest } from './requestHandler';
import { SenderWhitelist } from './senderWhitelist';

export async function requestCallback<T>(
  requestHandler: RequestHandler,
  senderWhitelist: SenderWhitelist,
  reason: string,
  type: 'getIdentities' | 'signAndPost',
  data: GetIdentitiesRequest | SignAndPostRequest,
  acceptResponse: T,
  rejectResponse: T,
): Promise<T> {
  return new Promise(resolve => {
    const accept = (): void => {
      requestHandler.solved();
      updateExtensionBadge(requestHandler.requests().length);
      updateRequestProvider();
      resolve(acceptResponse);
    };

    const reject = (permanent: boolean): void => {
      requestHandler.solved();
      if (permanent) {
        senderWhitelist.block(data.senderUrl);
        requestHandler.purge(data.senderUrl);
      }
      updateExtensionBadge(requestHandler.requests().length);
      updateRequestProvider();
      resolve(rejectResponse);
    };

    requestHandler.add({ reason, type, data, accept, reject });
    updateExtensionBadge(requestHandler.requests().length);
    updateRequestProvider();
  });
}
