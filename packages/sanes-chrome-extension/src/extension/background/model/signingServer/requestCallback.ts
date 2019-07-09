import { updateRequestProvider } from '../../updaters/appUpdater';
import { updateExtensionBadge } from '../../updaters/extensionBadgeUpdater';
import { GetIdentitiesData, RequestQueueManager, SignAndPostData } from './requestQueueManager';
import { SenderWhitelist } from './senderWhitelist';

export async function requestCallback<T>(
  requestQueueManager: RequestQueueManager,
  senderWhitelist: SenderWhitelist,
  reason: string,
  type: 'getIdentities' | 'signAndPost',
  data: GetIdentitiesData | SignAndPostData,
  acceptResponse: T,
  rejectResponse: T,
): Promise<T> {
  return new Promise(resolve => {
    const accept = (): void => {
      requestQueueManager.solved();
      updateExtensionBadge(requestQueueManager.requests().length);
      updateRequestProvider();
      resolve(acceptResponse);
    };

    const reject = (permanent: boolean): void => {
      requestQueueManager.solved();
      if (permanent) {
        senderWhitelist.block(data.senderUrl);
        requestQueueManager.purge(data.senderUrl);
      }
      updateExtensionBadge(requestQueueManager.requests().length);
      updateRequestProvider();
      resolve(rejectResponse);
    };

    requestQueueManager.add({ reason, type, data, accept, reject });
    updateExtensionBadge(requestQueueManager.requests().length);
    updateRequestProvider();
  });
}
