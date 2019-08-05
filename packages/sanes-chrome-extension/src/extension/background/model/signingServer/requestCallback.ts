import { updateRequestProvider } from "../../updaters/appUpdater";
import { updateExtensionBadge } from "../../updaters/extensionBadgeUpdater";
import {
  GetIdentitiesResponseData,
  RequestQueueManager,
  SignAndPostResponseData,
} from "./requestQueueManager";
import { SenderWhitelist } from "./senderWhitelist";

export async function requestCallback<T>(
  requestQueueManager: RequestQueueManager,
  senderWhitelist: SenderWhitelist,
  senderUrl: string,
  reason: string,
  responseData: GetIdentitiesResponseData | SignAndPostResponseData,
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
        senderWhitelist.block(senderUrl);
        requestQueueManager.purge(senderUrl);
      }
      updateExtensionBadge(requestQueueManager.requests().length);
      updateRequestProvider();
      resolve(rejectResponse);
    };

    requestQueueManager.add({ senderUrl, reason, responseData, accept, reject });
    updateExtensionBadge(requestQueueManager.requests().length);
    updateRequestProvider();
  });
}
