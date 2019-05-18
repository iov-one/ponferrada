/*global chrome*/
import { createPersona } from '../actions/createPersona';
import { getPersona } from '../actions/getPersona';
import { MessageToBackground, MessageToBackgroundAction } from '../messages';
import { createAccount } from '../actions/createAccount';

export function internalHandler(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void, // eslint-disable-line
): boolean {
  console.log(message, sender);

  if (sender.id !== chrome.runtime.id) {
    throw new Error('Sender is not allowed to perform this action');
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
    case MessageToBackgroundAction.CreateAccount:
      createAccount()
        .then(sendResponse)
        .catch(console.error);
      break;
    default:
      throw new Error('Unknown action');
  }

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
}
