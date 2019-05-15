import { Persona, PersonaManager } from '../../../logic/persona';
import { GetPersonaResponse } from '../../messages';

export async function getPersona(): Promise<GetPersonaResponse> {
  let persona: Persona;
  try {
    persona = PersonaManager.get();
  } catch (_) {
    return null;
  }

  return {
    mnemonic: persona.mnemonic,
    txs: await persona.getTxs(),
    accounts: await persona.getAccounts(),
  };
}
