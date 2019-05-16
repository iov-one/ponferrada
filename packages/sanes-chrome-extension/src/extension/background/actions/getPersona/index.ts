import { Persona } from '../../../../logic/persona';
import { GetPersonaResponse } from '../../messages';
import { getCreatedPersona } from '../createPersona';

export async function getPersona(): Promise<GetPersonaResponse> {
  let persona: Persona;
  try {
    persona = getCreatedPersona();
  } catch (_) {
    return null;
  }

  return {
    mnemonic: persona.mnemonic,
    txs: await persona.getTxs(),
    accounts: await persona.getAccounts(),
  };
}
