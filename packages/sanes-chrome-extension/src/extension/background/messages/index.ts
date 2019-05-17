/*global chrome*/
import { PersonaAcccount, ProcessedTx } from '../../../logic/persona';

// WTC means "web to content"
export const WTC_MSG_HELLO = 'wtc_HELLO';

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToBackgroundAction {
  CreatePersona = 'create_persona',
  GetPersona = 'get_persona',
  CreateAccount = 'create_account',
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

export interface PersonaData {
  readonly accounts: ReadonlyArray<PersonaAcccount>;
  readonly mnemonic: string;
  readonly txs: ReadonlyArray<ProcessedTx>;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface CreatePersonaResponse extends PersonaData {}

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

export type GetPersonaResponse = PersonaData | null;

export async function sendGetPersonaMessage(): Promise<GetPersonaResponse> {
  return new Promise((resolve, reject) => {
    const message: MessageToBackground = { action: MessageToBackgroundAction.GetPersona };
    chrome.runtime.sendMessage(message, response => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        const errorMessage = lastError.message || 'Unknown error in chrome.runtime.lastError';
        reject(errorMessage);
        return;
      }

      if (!response) {
        resolve(null);
      } else {
        resolve({
          accounts: response.accounts,
          mnemonic: response.mnemonic,
          txs: response.txs,
        });
      }
    });
  });
}

export interface CreateAccountResponse {
  /** An updated list of accounts */
  readonly accounts: ReadonlyArray<PersonaAcccount>;
}

export async function sendCreateAccountMessage(): Promise<CreateAccountResponse> {
  return new Promise((resolve, reject) => {
    const message: MessageToBackground = { action: MessageToBackgroundAction.CreateAccount };
    chrome.runtime.sendMessage(message, response => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        const errorMessage = lastError.message || 'Unknown error in chrome.runtime.lastError';
        reject(errorMessage);
        return;
      }
      resolve({ accounts: response.accounts });
    });
  });
}

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToForegroundAction {
  TransactionsChanges = 'transaction_changed',
  RequestChanges = 'request_changed',
}

/**
 * A message either from background script to foreground
 */
export interface MessageToForeground {
  readonly type: 'message_to_foreground';
  readonly action: MessageToForegroundAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}

export function isMessageToForeground(data: unknown, expectedAction: string): data is MessageToForeground {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const isForeground = (data as MessageToForeground).type === 'message_to_foreground';
  const matchesMsg = (data as MessageToForeground).action === expectedAction;

  return isForeground && matchesMsg;
}
