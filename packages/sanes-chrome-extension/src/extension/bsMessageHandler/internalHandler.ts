/*global chrome*/
import { ReadonlyDate } from 'readonly-date';
import { Encoding } from '@iov/encoding';
import { GetIdentitiesAuthorization, SignAndPostAuthorization, SignedAndPosted } from '@iov/core';
import { PublicIdentity, isSendTransaction, publicIdentityEquals } from '@iov/bcp';

import {
  MessageToBackgroundAction,
  MessageToBackground,
  GetPersonaResponse,
  MessageToForeground,
  MessageToForegroundAction,
} from '../messages';
import { UseOnlyJsonRpcSigningServer, PersonaManager, Persona, ProcessedTx } from '../../logic/persona';
import { isNewSender } from './senderWhitelist';

export type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
let signingServer: SigningServer;

export function getSigningServer(): SigningServer {
  return signingServer;
}

function isNonNull<T>(t: T | null): t is T {
  return t !== null;
}

export async function handleInternalMessage(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.log(message, sender);

  if (sender.id !== chrome.runtime.id) {
    return 'Sender is not allowed to perform this action';
  }

  switch (message.action) {
    case MessageToBackgroundAction.GetPersona: {
      let persona: Persona | undefined;
      try {
        persona = PersonaManager.get();
      } catch (_) {}
      let response: GetPersonaResponse;
      if (persona) {
        response = {
          mnemonic: persona.mnemonic,
          txs: await persona.getTxs(),
          accounts: await persona.getAccounts(),
        };
      } else {
        response = null;
      }
      return response;
    }
    case MessageToBackgroundAction.CreatePersona: {
      let response;
      try {
        const persona = await PersonaManager.create(message.data);

        const getIdentitiesCallback: GetIdentitiesAuthorization = async (
          reason,
          matchingIdentities
        ): Promise<ReadonlyArray<PublicIdentity>> => {
          if (isNewSender('http://finnex.com')) {
            chrome.browserAction.setIcon({ path: 'assets/icons/request128.png' });
            chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
            chrome.browserAction.setBadgeText({ text: '*' });
          }

          return matchingIdentities;
        };

        const signAndPostCallback: SignAndPostAuthorization = async (): Promise<boolean> => {
          return true;
        };

        async function transactionsChangedHandler(
          transactions: ReadonlyArray<SignedAndPosted>
        ): Promise<void> {
          const identities = (await persona.getAccounts())[0].identities;
          const txs: ReadonlyArray<ProcessedTx> = transactions
            .map(
              (t): ProcessedTx | null => {
                if (!isSendTransaction(t.transaction)) {
                  // cannot process
                  return null;
                }

                return {
                  time: new ReadonlyDate(ReadonlyDate.now()),
                  id: t.postResponse.transactionId,
                  recipient: t.transaction.recipient,
                  signer: Encoding.toHex(t.transaction.creator.pubkey.data),
                  memo: t.transaction.memo,
                  amount: t.transaction.amount,
                  received: !identities.find(i => publicIdentityEquals(i, t.transaction.creator)),
                  success: true,
                };
              }
            )
            .filter(isNonNull);

          const message: MessageToForeground = {
            type: 'message_to_foreground',
            action: MessageToForegroundAction.TransactionsChanges,
            data: txs,
          };
          chrome.runtime.sendMessage(message);
        }

        signingServer = persona.startSigningServer(
          getIdentitiesCallback,
          signAndPostCallback,
          transactionsChangedHandler
        );
        console.log('Signing server ready to handle requests');

        response = {
          mnemonic: persona.mnemonic,
          txs: await persona.getTxs(),
          accounts: await persona.getAccounts(),
        };
      } catch (error) {
        console.error('Error when creating persona:', error);
        response = error;
      }
      return response;
    }
    default:
      return 'Unknown action';
  }
}
