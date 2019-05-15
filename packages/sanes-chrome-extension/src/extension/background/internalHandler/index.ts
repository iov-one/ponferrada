/*global chrome*/
import { PublicIdentity } from '@iov/bcp';
import { GetIdentitiesAuthorization, SignAndPostAuthorization } from '@iov/core';
import { Persona, PersonaManager, ProcessedTx, UseOnlyJsonRpcSigningServer } from '../../../logic/persona';
import {
  GetPersonaResponse,
  MessageToBackground,
  MessageToBackgroundAction,
  MessageToForeground,
  MessageToForegroundAction,
} from '../../messages';
import { updateExtensionBadge } from './badgeUpdater';
import { RequestHandler } from './requestHandler';
import { isRequestMeta } from './requestMeta';
import { SenderWhitelist } from './senderWhitelist';

export type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
let signingServer: SigningServer;

export function getSigningServer(): SigningServer {
  return signingServer;
}

export async function handleInternalMessage(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender,
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
          matchingIdentities,
          meta,
        ): Promise<ReadonlyArray<PublicIdentity>> => {
          if (!isRequestMeta(meta)) {
            throw new Error('Unexpected type of data in meta field');
          }
          const { senderUrl } = meta;

          return new Promise(resolve => {
            const accept = (): void => {
              RequestHandler.solved();
              updateExtensionBadge();

              resolve(matchingIdentities);
            };

            const reject = (permanent: boolean): void => {
              if (permanent) {
                SenderWhitelist.block(senderUrl);
              }
              RequestHandler.solved();
              updateExtensionBadge();

              resolve([]);
            };

            RequestHandler.add({ reason, sender: meta.senderUrl, accept, reject });
            updateExtensionBadge();
          });
        };

        const signAndPostCallback: SignAndPostAuthorization = async (
          reason,
          _transaction,
          meta,
        ): Promise<boolean> => {
          if (!isRequestMeta(meta)) {
            throw new Error('Unexpected type of data in meta field');
          }

          const { senderUrl } = meta;

          return new Promise(resolve => {
            const accept = (): void => {
              RequestHandler.solved();
              updateExtensionBadge();

              resolve(true);
            };

            const reject = (permanent: boolean): void => {
              if (permanent) {
                SenderWhitelist.block(senderUrl);
              }
              RequestHandler.solved();
              updateExtensionBadge();

              resolve(false);
            };

            RequestHandler.add({ reason, sender: meta.senderUrl, accept, reject });
            updateExtensionBadge();
          });
        };

        function transactionsChangedHandler(transactions: ReadonlyArray<ProcessedTx>): void {
          const message: MessageToForeground = {
            type: 'message_to_foreground',
            action: MessageToForegroundAction.TransactionsChanges,
            data: transactions,
          };
          chrome.runtime.sendMessage(message);
        }

        signingServer = persona.startSigningServer(
          getIdentitiesCallback,
          signAndPostCallback,
          transactionsChangedHandler,
        );
        console.log('Signing server ready to handle requests');

        SenderWhitelist.load();
        RequestHandler.create();

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
