/*global chrome*/
import { MessageToBackground, MessageToBackgroundAction, WTC_MSG_HELLO } from './messages';

export const main = async (): Promise<void> => {
  window.addEventListener(WTC_MSG_HELLO, function(): void {
    const data: MessageToBackground = {
      action: MessageToBackgroundAction.ContentToBackground,
    };

    chrome.runtime.sendMessage(data);
  });
};
