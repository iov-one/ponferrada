/*global chrome*/
import { ProcessedTx } from '../logic/persona';
import { AccountInfo } from '../logic/persona/accountManager';

// WTC means "web to content"
export const WTC_MSG_HELLO = 'wtc_HELLO';

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToBackgroundAction {
  CreatePersona = 'create_persona',
}

/**
 * A message either from content script to background script or
 * from extension foreground to background script.
 */
export interface MessageToBackground {
  readonly action: MessageToBackgroundAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}

export interface CreatePersonaResponse {
  readonly accounts: ReadonlyArray<AccountInfo>;
  readonly mnemonic: string;
  readonly txs: ReadonlyArray<ProcessedTx>;
}

export async function sendCreatePersonaMessage(mnemonic?: string): Promise<CreatePersonaResponse> {
  return new Promise((resolve, reject) => {
    const message: MessageToBackground = {
      action: MessageToBackgroundAction.CreatePersona,
      data: mnemonic,
    };
    chrome.runtime.sendMessage(message, response => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        const errorMessage = lastError.message || 'Unknown error in chrome.runtime.lastError';
        reject(errorMessage);
        return;
      }

      console.log(response);
      resolve({
        accounts: response.accounts,
        mnemonic: response.mnemonic,
        txs: response.txs,
      });
    });
  });
}
