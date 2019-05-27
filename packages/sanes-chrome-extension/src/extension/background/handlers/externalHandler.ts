import { getSigningServer } from '../actions/createPersona';
import { RequestMeta } from '../actions/createPersona/requestHandler';
import { SenderWhitelist } from '../actions/createPersona/requestSenderWhitelist';
import { generateErrorResponse } from '../errorResponseGenerator';

export function handleExternalMessage(
  request: any, //eslint-disable-line
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void, //eslint-disable-line
): boolean {
  const responseId = typeof request.id === 'number' ? request.id : null;
  if (!sender.url) {
    sendResponse(generateErrorResponse(responseId, 'Got external message without sender URL'));
    return false;
  }

  const signingServer = getSigningServer();
  if (!signingServer) {
    sendResponse(generateErrorResponse(responseId, 'Signing server not ready'));
    return false;
  }

  const { url: senderUrl } = sender;
  if (SenderWhitelist.isBlocked(senderUrl)) {
    sendResponse(generateErrorResponse(responseId, 'Sender has been blocked by user'));
    return false;
  }

  const meta: RequestMeta = {
    senderUrl,
  };

  signingServer
    .handleUnchecked(request, meta)
    .then(sendResponse)
    .catch(sendResponse);

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
}
