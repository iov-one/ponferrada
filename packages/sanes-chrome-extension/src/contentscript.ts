import { MsgToBackground } from "./extension/utils/types.js";
import { WTC_MSG_HELLO, CTB_MSG_HELLO } from "./extension/utils/messages";

export const main = async (): Promise<void> => {
  window.addEventListener(WTC_MSG_HELLO, function() {
    const data: MsgToBackground = {
      msg: CTB_MSG_HELLO,
      data: undefined,
    };

    chrome.runtime.sendMessage(data);
  });
};
