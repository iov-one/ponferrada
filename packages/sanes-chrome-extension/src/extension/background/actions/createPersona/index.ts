import { Persona, UseOnlyJsonRpcSigningServer } from '../../../../logic/persona';
import { CreatePersonaResponse } from '../../messages';
import { transactionsUpdater } from './requestAppUpdater';
import { getIdentitiesCallback, signAndPostCallback } from './requestCallback';
import { RequestHandler } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

export type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
let signingServer: SigningServer;
let persona: Persona;

export function getSigningServer(): SigningServer {
  return signingServer;
}

export function getCreatedPersona(): Persona {
  if (!persona) {
    throw new Error('Persona instance does not exist');
  }
  return persona;
}

export async function createPersona(mnemonic?: string): Promise<CreatePersonaResponse> {
  persona = await Persona.create(mnemonic);
  signingServer = persona.startSigningServer(getIdentitiesCallback, signAndPostCallback, transactionsUpdater);
  console.log('Signing server ready to handle requests');

  SenderWhitelist.load();
  RequestHandler.load();

  return {
    mnemonic: persona.mnemonic,
    txs: await persona.getTxs(),
    accounts: await persona.getAccounts(),
  };
}
