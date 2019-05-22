/*global chrome*/
import { createBrowserDb } from '../logic/db';
import { Request, RequestHandler } from './background/actions/createPersona/requestHandler';
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
  return handleExternalMessage(db, message, sender, sendResponse);
});

function getQueuedRequests(): ReadonlyArray<Request> {
  return RequestHandler.requests();
}

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
}

(window as IovWindowExtension).getQueuedRequests = getQueuedRequests;
