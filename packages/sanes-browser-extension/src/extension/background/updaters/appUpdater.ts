/**
 * String values will be used in the JSON message objects
 */
export enum MessageToForegroundAction {
  RequestsChanged = "requests_changed",
}

/**
 * A message from background script to foreground.
 *
 * Those messages are sent independent of the existence of a foreground script (i.e. UI open).
 * When there is no UI, the messages have no effect.
 */
export interface MessageToForeground {
  readonly type: "message_to_foreground";
  readonly action: MessageToForegroundAction;
  readonly data?: any;
}

export function isMessageToForeground(data: unknown): data is MessageToForeground {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return (data as MessageToForeground).type === "message_to_foreground";
}

export function updateRequestProvider(): void {
  const message: MessageToForeground = {
    type: "message_to_foreground",
    action: MessageToForegroundAction.RequestsChanged,
  };
  chrome.runtime.sendMessage(message);
}
