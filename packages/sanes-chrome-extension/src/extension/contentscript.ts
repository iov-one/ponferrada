/*global chrome*/
import { MessageToBackground } from './utils/types.js';
import { WTC_MSG_HELLO, CTB_MSG_HELLO } from './utils/messages';

export const main = async (): Promise<void> => {
  window.addEventListener(WTC_MSG_HELLO, function(): void {
    const data: MessageToBackground = {
      action: CTB_MSG_HELLO,
    };

    chrome.runtime.sendMessage(data);
  });
};
