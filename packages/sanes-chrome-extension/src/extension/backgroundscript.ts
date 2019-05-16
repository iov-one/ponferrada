/*global chrome*/
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
