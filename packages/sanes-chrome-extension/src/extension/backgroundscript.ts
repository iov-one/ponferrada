/*global chrome*/
import { Request, RequestHandler } from './background/actions/createPersona/requestHandler';
import { handleExternalMessage } from './background/handlers/externalHandler';
import { internalHandler } from './background/handlers/internalHandler';

/**
 * Listener for dispatching extension requests
 */
chrome.runtime.onMessage.addListener(internalHandler);

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener(handleExternalMessage);

function getQueuedRequests(): ReadonlyArray<Request> {
  return RequestHandler.requests();
}

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
}

(window as IovWindowExtension).getQueuedRequests = getQueuedRequests;
