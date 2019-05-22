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

export function clearPersona(): void {
  if (!instance) {
    throw new Error('The persona+server instance is unset. This indicates a bug in the lifecycle.');
  }
  instance.persona.destroy();
  instance = undefined;
}

export async function createPersona(mnemonic?: string): Promise<CreatePersonaResponse> {
  if (instance) {
    throw new Error('The persona+server instance is already set. This indicates a bug in the lifecycle.');
  }

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
