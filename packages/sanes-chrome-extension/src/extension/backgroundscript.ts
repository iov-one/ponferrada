import { wrapStore } from 'webext-redux';
import { JsonRpcErrorResponse } from '@iov/jsonrpc';

import { MsgToBackground } from './utils/types';
import { CTB_MSG_HELLO } from './utils/messages';
import { WELCOME_ROUTE } from '../routes/paths';
import { makeStore } from '../store';
import { history } from '../store/reducers';

wrapStore(makeStore());

// https://developer.chrome.com/extensions/messaging#simple
chrome.runtime.onMessage.addListener(
  (message: MsgToBackground, sender: chrome.runtime.MessageSender, sendResponse): void => {
    switch (message.msg) {
      case CTB_MSG_HELLO:
        if (sender.tab) {
          console.log('Received message from: ' + sender.tab.id);
        }
        sendResponse({ msg: 'Hello mate' });
        history.push(WELCOME_ROUTE);
        // do an operation in the extension
        // replying back to content script
        break;

      default:
    }
  }
);

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log('Passing from background to app', request);
  chrome.runtime.sendMessage(request, response => {
    if (chrome.runtime.lastError) {
      console.warn('Could not pass message to app');
      const error: JsonRpcErrorResponse = {
        jsonrpc: '2.0',
        id: typeof request.id === 'number' ? request.id : null,
        error: {
          code: -32000,
          message: 'Signing server not ready',
        },
      };
      sendResponse(error);
      return;
    }
    sendResponse(response);
  });

  // return true to keep the sendResponse reference alive, see
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal#Parameters
  return true;
});
