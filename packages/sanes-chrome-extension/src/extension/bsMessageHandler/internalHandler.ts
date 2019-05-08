/*global chrome*/
import { MessageToBackgroundAction, MessageToBackground } from '../messages';
import { UseOnlyJsonRpcSigningServer, PersonaManager } from '../../logic/persona';

export type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
let signingServer: SigningServer;

export function getSigningServer(): SigningServer {
  return signingServer;
}

export async function handleInternalMessage(
  message: MessageToBackground,
  sender: chrome.runtime.MessageSender
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.log(message, sender);
  switch (message.action) {
    case MessageToBackgroundAction.CreatePersona:
      if (sender.id !== chrome.runtime.id) {
        return 'Sender is not allowed to perform this action';
      }
      let response;
      try {
        const persona = await PersonaManager.create(message.data);

        signingServer = persona.startSigningServer();
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
    default:
      return 'Unknown action';
  }
}
