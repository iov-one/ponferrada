/*global chrome*/
import { createBrowserDb } from '../logic/db';
import { Request, RequestHandler } from './background/actions/createPersona/requestHandler';
import { generateErrorResponse } from './background/errorResponseGenerator';
import { handleExternalMessage } from './background/handlers/externalHandler';
import { internalHandler } from './background/handlers/internalHandler';

// Instance lives as long as the BS lives. Never closed unless the background script is destroyed.
const db = createBrowserDb('bs-persona');

/**
 * Listener for dispatching extension requests
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return internalHandler(db, message, sender, sendResponse);
});

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  handleExternalMessage(message, sender)
    .then(sendResponse)
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.error(error);

      // exception in handleExternalMessage are most likely programming errors, since all
      // data validation must lead to an error response. Thus we return a server error without
      // revealing error details to the caller.
      const responseId = typeof message.id === 'number' ? message.id : null;
      const response = generateErrorResponse(responseId, 'Internal server error');
      sendResponse(response);
    });

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
});

function getQueuedRequests(): ReadonlyArray<Request> {
  return RequestHandler.requests();
}

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
}

(window as IovWindowExtension).getQueuedRequests = getQueuedRequests;
