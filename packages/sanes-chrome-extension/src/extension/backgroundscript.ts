/*global chrome*/
import { wrapStore } from 'webext-redux';
import { MessageToBackground, MessageToBackgroundAction } from './messages';
import { makeStore } from '../store';
import { PersonaManager, UseOnlyJsonRpcSigningServer } from '../logic/persona';
import { handleExternalMessage } from './bsMessageHandler/externalHandler';

wrapStore(makeStore());

let signingServer: UseOnlyJsonRpcSigningServer | undefined;

async function handleInternalMessage(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.log(message, sender);
  switch (message.action) {
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

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  handleExternalMessage(signingServer, request)
    .then(sendResponse)
    .catch(console.error);

  // return true to keep the sendResponse reference alive, see
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal#Parameters
  return true;
});
