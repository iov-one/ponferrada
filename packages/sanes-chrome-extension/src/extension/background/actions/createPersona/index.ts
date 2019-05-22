import { Persona, UseOnlyJsonRpcSigningServer } from '../../../../logic/persona';
import { CreatePersonaResponse } from '../../messages';
import { transactionsUpdater } from './requestAppUpdater';
import { getIdentitiesCallback, signAndPostCallback } from './requestCallback';
import { RequestHandler } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

interface PersonaWithSigningServer {
  readonly persona: Persona;
  readonly signingServer: UseOnlyJsonRpcSigningServer;
}

let instance: PersonaWithSigningServer | undefined;

export function getSigningServer(): UseOnlyJsonRpcSigningServer | undefined {
  return instance ? instance.signingServer : undefined;
}

export function getCreatedPersona(): Persona {
  if (!instance) {
    throw new Error('Persona instance does not exist');
  }
  return instance.persona;
}

function clear(): void {
  instance = undefined;
}

export async function createPersona(mnemonic?: string): Promise<CreatePersonaResponse> {
  clear(); // Assure we start from clean instances

  const persona = await Persona.create(mnemonic);
  const signingServer = persona.startSigningServer(
    getIdentitiesCallback,
    signAndPostCallback,
    transactionsUpdater,
  );
  instance = { persona, signingServer };

  SenderWhitelist.load();
  RequestHandler.load();

  return {
    mnemonic: persona.mnemonic,
    txs: await persona.getTxs(),
    accounts: await persona.getAccounts(),
  };
}
