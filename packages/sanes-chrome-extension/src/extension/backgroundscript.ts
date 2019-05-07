/*global chrome*/
import { wrapStore } from 'webext-redux';
import { JsonRpcErrorResponse } from '@iov/jsonrpc';

import { MessageToBackground, MessageToBackgroundAction } from './messages';
import { makeStore } from '../store';
import { PersonaManager, UseOnlyJsonRpcSigningServer } from '../logic/persona';

wrapStore(makeStore());

let signingServer: UseOnlyJsonRpcSigningServer | undefined;

async function handleInternalMessage(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.log(message, sender);
  switch (message.action) {
    case MessageToBackgroundAction.ContentToBackground:
      if (sender.tab) {
        console.log('Received message from: ' + sender.tab.id);
      }
      return { msg: 'Hello mate' };
    case MessageToBackgroundAction.CreatePersona:
      if (sender.id !== chrome.runtime.id) {
        return 'Sender is not allowed to perform this action';
      }
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
      return response;
    default:
      return 'Unknown action';
  }
}

// https://developer.chrome.com/extensions/messaging#simple
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
