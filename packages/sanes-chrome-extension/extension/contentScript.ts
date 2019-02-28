import { WTC_MSG_HELLO, CTB_MSG_HELLO } from "./utils/messages";
import { MsgToBackground } from "./utils/types";

window.addEventListener(WTC_MSG_HELLO, function() {
  const data: MsgToBackground = {
    msg: CTB_MSG_HELLO,
    data: undefined,
  };

  chrome.runtime.sendMessage(data);
});
