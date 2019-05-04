/*global chrome*/
import { MsgToBackground } from './utils/types.js';
import { WTC_MSG_HELLO, CTB_MSG_HELLO } from './utils/messages';

export const main = async (): Promise<void> => {
  window.addEventListener(WTC_MSG_HELLO, function(): void {
    const data: MsgToBackground = {
      msg: CTB_MSG_HELLO,
      data: undefined,
    };

    chrome.runtime.sendMessage(data);
  });
};
