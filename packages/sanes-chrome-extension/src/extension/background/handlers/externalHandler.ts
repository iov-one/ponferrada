import { getSigningServer } from '../actions/createPersona';
import { RequestMeta } from '../actions/createPersona/requestCallback';
import { generateErrorResponse } from '../errorResponseGenerator';

export function handleExternalMessage(
  request: any, //eslint-disable-line
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void, //eslint-disable-line
): boolean {
  if (!sender.url) {
    throw new Error('Got external message without sender URL');
  }

  const signingServer = getSigningServer();
  if (!signingServer) {
    const responseId = typeof request.id === 'number' ? request.id : null;
    const error = generateErrorResponse(responseId, 'Signing server not ready');
    sendResponse(error);

    return false;
  }

  const meta: RequestMeta = {
    senderUrl: sender.url,
  };

  signingServer
    .handleUnchecked(request, meta)
    .then(sendResponse)
    .catch(console.error);

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
}
