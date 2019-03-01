(async () => {
  const src = chrome.extension.getURL("extension/contentMain.js");
  const contentScript = await import(src);
  await contentScript.main();
})();
/*
  // web
  const showPopupEvent = new window.CustomEvent(
      EV_SHOW_POPUP,
      { detail: payload.params[0] }
    )
    document.dispatchEvent(showPopupEvent)

  // content script
  window.addEventListener(messages.EV_SHOW_POPUP_TX, (data) => {
    chrome.runtime.sendMessage({
      msg: messages.MSG_SHOW_POPUP_TX,
      tx: data.detail
    })
  })

  // background script
  case messages.MSG_SHOW_POPUP_TX:
        if (isWhiteListedDapp(normalizeUrl(sender.tab.url))) {
          showSendTransactionPopup(request.tx, sender.tab.windowId, sender.tab.id)
        }
        break

*/
