import { wrapStore } from 'webext-redux';
import { MsgToBackground } from './utils/types';
import { CTB_MSG_HELLO } from './utils/messages';
import { WELCOME_ROUTE } from '../routes/paths';
import { makeStore } from '../store';
import { history } from '../store/reducers';

wrapStore(makeStore());

// https://developer.chrome.com/extensions/messaging#simple
chrome.runtime.onMessage.addListener(
  (
    message: MsgToBackground,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ) => {
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
