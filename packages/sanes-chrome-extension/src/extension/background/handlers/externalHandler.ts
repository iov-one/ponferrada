import { getSigningServer } from '../actions/createPersona';
import { RequestMeta } from '../actions/createPersona/requestHandler';
import { SenderWhitelist } from '../actions/createPersona/requestSenderWhitelist';
import { generateErrorResponse } from '../errorResponseGenerator';

function resolveToError(
  sendResponse: (response?: any) => void, //eslint-disable-line
  responseId: number | null,
  msg: string,
): boolean {
  const error = generateErrorResponse(responseId, msg);
  sendResponse(error);

  return false;
}

export function handleExternalMessage(
  request: any, //eslint-disable-line
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void, //eslint-disable-line
): boolean {
  const responseId = typeof request.id === 'number' ? request.id : null;
  if (!sender.url) {
    return resolveToError(sendResponse, responseId, 'Got external message without sender URL');
  }

  const signingServer = getSigningServer();
  if (!signingServer) {
    return resolveToError(sendResponse, responseId, 'Signing server not ready');
  }

  const { url: senderUrl } = sender;
  if (SenderWhitelist.isBlocked(senderUrl)) {
    return resolveToError(sendResponse, responseId, 'Sender has been blocked by user');
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
