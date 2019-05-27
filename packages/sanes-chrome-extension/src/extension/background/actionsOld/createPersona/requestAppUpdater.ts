/*global chrome*/
import { ProcessedTx } from '../../../../logic/persona';
import { MessageToForeground, MessageToForegroundAction } from '../../messages';

export function transactionsUpdater(transactions: ReadonlyArray<ProcessedTx>): void {
  const message: MessageToForeground = {
    type: 'message_to_foreground',
    action: MessageToForegroundAction.TransactionsChanged,
    data: transactions,
  };
  chrome.runtime.sendMessage(message);
}

export function requestUpdater(): void {
  const message: MessageToForeground = {
    type: 'message_to_foreground',
    action: MessageToForegroundAction.RequestsChanged,
  };
  chrome.runtime.sendMessage(message);
}
