import { PersonaManager, UseOnlyJsonRpcSigningServer } from '../../../logic/persona';
import { CreatePersonaResponse } from '../messages';
import { transactionsUpdater } from './requestAppUpdater';
import { getIdentitiesCallback, signAndPostCallback } from './requestCallback';
import { RequestHandler } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

export type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
let signingServer: SigningServer;

export function getSigningServer(): SigningServer {
  return signingServer;
}

export async function createPersona(mnemonic?: string): Promise<CreatePersonaResponse> {
  // TODO refactor when #175
  const persona = await PersonaManager.create(mnemonic);
  signingServer = persona.startSigningServer(getIdentitiesCallback, signAndPostCallback, transactionsUpdater);
  console.log('Signing server ready to handle requests');

  SenderWhitelist.load();
  RequestHandler.create();

  return {
    mnemonic: persona.mnemonic,
    txs: await persona.getTxs(),
    accounts: await persona.getAccounts(),
  };
}
