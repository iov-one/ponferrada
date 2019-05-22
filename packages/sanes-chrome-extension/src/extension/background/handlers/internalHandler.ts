/*global chrome*/
import { createPersona, loadPersona } from '../actions/createPersona';
import { getPersona } from '../actions/getPersona';
import { MessageToBackground, MessageToBackgroundAction } from '../messages';
import { createAccount } from '../actions/createAccount';
import { StringDb } from '../../../logic/db';

export function internalHandler(
  db: StringDb,
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void, // eslint-disable-line
): boolean {
  if (sender.id !== chrome.runtime.id) {
    throw new Error('Sender is not allowed to perform this action');
  }

  switch (message.action) {
    case MessageToBackgroundAction.GetPersona:
      getPersona()
        .then(sendResponse)
        // eslint-disable-next-line no-console
        .catch(console.error);
      break;
    case MessageToBackgroundAction.CreatePersona: {
      const { password, mnemonic } = message.data;
      createPersona(db, password, mnemonic)
        .then(sendResponse)
        // eslint-disable-next-line no-console
        .catch(console.error);
      break;
    }
    case MessageToBackgroundAction.LoadPersona: {
      const { password } = message.data;
      loadPersona(db, password)
        .then(sendResponse)
        .catch(console.error);
      break;
    }
    case MessageToBackgroundAction.CreateAccount:
      createAccount()
        .then(sendResponse)
        // eslint-disable-next-line no-console
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
