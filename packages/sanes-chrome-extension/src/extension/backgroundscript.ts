/*global chrome*/
import { generateErrorResponse } from './background/errorResponseGenerator';
import { getSigningServer, handleInternalMessage } from './background/internalHandler';
import { MessageToBackground } from './messages';

// For a better understanding about the message change done visit:
// https://developer.chrome.com/extensions/messaging#simple

/**
 * Listener for dispatching extension requests
 */
chrome.runtime.onMessage.addListener((message: MessageToBackground, sender, sendResponse) => {
  handleInternalMessage(message, sender)
    .then(sendResponse)
    .catch(console.error);

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
});

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  const signingServer = getSigningServer();
  if (!signingServer) {
    const responseId = typeof request.id === 'number' ? request.id : null;
    const error = generateErrorResponse(responseId, 'Signing server not ready');
    sendResponse(error);

    return false;
  }

  signingServer
    .handleUnchecked(request)
    .then(sendResponse)
    .catch(console.error);

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
});
