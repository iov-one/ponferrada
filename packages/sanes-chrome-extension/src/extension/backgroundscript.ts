/*global chrome*/
import { createPersona, getSigningServer } from './background/createPersona';
import { RequestMeta } from './background/createPersona/requestCallback';
import { generateErrorResponse } from './background/errorResponseGenerator';
import { getPersona } from './background/getPersona';
import { MessageToBackground, MessageToBackgroundAction } from './background/messages';

/**
 * Listener for dispatching extension requests
 */
chrome.runtime.onMessage.addListener((message: MessageToBackground, sender, sendResponse) => {
  console.log(message, sender);

  if (sender.id !== chrome.runtime.id) {
    return 'Sender is not allowed to perform this action';
  }

  switch (message.action) {
    case MessageToBackgroundAction.GetPersona:
      getPersona()
        .then(sendResponse)
        .catch(console.error);
      break;
    case MessageToBackgroundAction.CreatePersona:
      createPersona()
        .then(sendResponse)
        .catch(console.error);
      break;
    default:
      return 'Unknown action';
  }

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
});

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener(
  (request, sender: chrome.runtime.MessageSender, sendResponse) => {
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
  },
);
