/*global chrome*/
import { MessageToBackground, MessageToBackgroundAction } from './utils/types';
import { WTC_MSG_HELLO } from './utils/messages';

export const main = async (): Promise<void> => {
  window.addEventListener(WTC_MSG_HELLO, function(): void {
    const data: MessageToBackground = {
      action: MessageToBackgroundAction.ContentToBackground,
    };

    chrome.runtime.sendMessage(data);
  });
};
