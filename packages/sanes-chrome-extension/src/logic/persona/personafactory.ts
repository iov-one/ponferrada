import { Persona } from './persona';
import { singleton } from '../../utils/singleton';

async function createPersonaWithRandomMnemonic(): Promise<Persona> {
  return Persona.create();
}

// TODO: Remove this when https://github.com/iov-one/ponferrada/pull/85 is done
export const getGlobalPersona = singleton<
  typeof createPersonaWithRandomMnemonic
>(createPersonaWithRandomMnemonic);
