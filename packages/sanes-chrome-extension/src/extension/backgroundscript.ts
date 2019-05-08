/*global chrome*/
import { wrapStore } from 'webext-redux';
import { MessageToBackground } from './messages';
import { makeStore } from '../store';
import { handleExternalMessage } from './bsMessageHandler/externalHandler';
import { handleInternalMessage, getSigningServer } from './bsMessageHandler/internalHandler';

wrapStore(makeStore());
// For a better understanding about the message change done visit:
// https://developer.chrome.com/extensions/messaging#simple

/**
 * Listener for dispatching extension requests
 */
chrome.runtime.onMessage.addListener((message: MessageToBackground, sender, sendResponse) => {
  handleInternalMessage(message, sender)
    .then(sendResponse)
    .catch(console.error);

  // return true to keep the sendResponse reference alive, see
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  // However, the Promise return type seems to not work.
  //
  // > If you want to asynchronously use sendResponse, add return true; to the onMessage event handler.
  // https://developer.chrome.com/extensions/messaging#simple
  return true;
});

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  const signingServer = getSigningServer();
  handleExternalMessage(signingServer, request)
    .then(sendResponse)
    .catch(console.error);

  // return true to keep the sendResponse reference alive, see
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal#Parameters
  return true;
});
