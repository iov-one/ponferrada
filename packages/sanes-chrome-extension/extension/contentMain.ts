import { MsgToBackground } from "./utils/types.js";

export const main = async (): Promise<void> => {
  const { WTC_MSG_HELLO, CTB_MSG_HELLO } = await import(chrome.extension.getURL(
    "extension/utils/messages.js",
  ));

  window.addEventListener(WTC_MSG_HELLO, function() {
    const data: MsgToBackground = {
      msg: CTB_MSG_HELLO,
      data: undefined,
    };

    chrome.runtime.sendMessage(data);
  });
};
