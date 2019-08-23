/*global chrome*/
import { ProcessedTx } from "../model/persona";

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToForegroundAction {
  TransactionsChanged = "transactions_changed",
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

/**
 * This is called whenever the list of transactions is updated.
 * It sends a TransactionsChanged message to the UI.
 *
 * The transactions are not included in that message to avoid the need
 * to serialize them as JSON. Instead, the UI pulls the latest list of
 * transactions from the background script.
 */
export function transactionsUpdater(_transactions: readonly ProcessedTx[]): void {
  const message: MessageToForeground = {
    type: "message_to_foreground",
    action: MessageToForegroundAction.TransactionsChanged,
  };
  chrome.runtime.sendMessage(message);
}

export function updateRequestProvider(): void {
  const message: MessageToForeground = {
    type: "message_to_foreground",
    action: MessageToForegroundAction.RequestsChanged,
  };
  chrome.runtime.sendMessage(message);
}
