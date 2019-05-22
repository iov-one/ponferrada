import { StringDb } from '../../../../logic/db';
import { Persona, UseOnlyJsonRpcSigningServer } from '../../../../logic/persona';
import { CreatePersonaResponse, LoadPersonaResponse, PersonaData } from '../../messages';
import { transactionsUpdater } from './requestAppUpdater';
import { getIdentitiesCallback, signAndPostCallback } from './requestCallback';
import { RequestHandler } from './requestHandler';
import { SenderWhitelist } from './requestSenderWhitelist';

interface PersonaWithSigningServer {
  readonly persona: Persona;
  readonly signingServer: UseOnlyJsonRpcSigningServer;
}

let instance: PersonaWithSigningServer | undefined;

async function setupPersonaAndSigningServer(persona: Persona): Promise<PersonaData> {
  if (instance) {
    throw new Error('The persona+server instance is already set. This indicates a bug in the lifecycle.');
  }

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

export async function loadPersona(db: StringDb, password: string): Promise<LoadPersonaResponse> {
  const persona = await Persona.load(db, password);
  return setupPersonaAndSigningServer(persona);
}

export async function createPersona(db: StringDb, mnemonic?: string): Promise<CreatePersonaResponse> {
  // TODO: do not use hardcoded password
  const persona = await Persona.create(db, 'passwd', mnemonic);
  return setupPersonaAndSigningServer(persona);
}
