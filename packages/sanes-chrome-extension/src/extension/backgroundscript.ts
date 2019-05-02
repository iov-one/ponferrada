/*global chrome*/
import { wrapStore } from 'webext-redux';
import { JsonRpcErrorResponse } from '@iov/jsonrpc';

import { MessageToBackground } from './utils/types';
import { CTB_MSG_HELLO } from './utils/messages';
import { WELCOME_ROUTE } from '../routes/paths';
import { makeStore } from '../store';
import { history } from '../store/reducers';
import { PersonaManager, UseOnlyJsonRpcSigningServer } from '../logic/persona';

wrapStore(makeStore());

let signingServer: UseOnlyJsonRpcSigningServer | undefined;

// https://developer.chrome.com/extensions/messaging#simple
chrome.runtime.onMessage.addListener(
  async (message: MessageToBackground, sender: chrome.runtime.MessageSender, sendResponse): Promise<void> => {
    console.log(message, sender);
    switch (message.action) {
      case CTB_MSG_HELLO:
        if (sender.tab) {
          console.log('Received message from: ' + sender.tab.id);
        }
        sendResponse({ msg: 'Hello mate' });
        history.push(WELCOME_ROUTE);
        // do an operation in the extension
        // replying back to content script
        break;
      case 'create_persona':
        let response;
        try {
          const persona = await PersonaManager.create(message.data);

          signingServer = persona.startSigningServer();
          console.log('Signing server ready to handle requests');

          response = {
            mnemonic: persona.mnemonic,
            txs: await persona.getTxs(),
            accounts: await persona.getAccounts(),
          };
        } catch (error) {
          console.error('Error when creating persona:', error);
          response = error;
        }
        sendResponse(response);
        break;
      default:
        sendResponse('Unknown action');
    }
  }
);

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (!signingServer) {
    console.warn('Could not pass message to signing server');
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

  signingServer
    .handleUnchecked(request)
    .then(response => {
      console.log('Responding', response);
      sendResponse(response);
    })
    .catch(console.error);

  // return true to keep the sendResponse reference alive, see
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal#Parameters
  return true;
});
