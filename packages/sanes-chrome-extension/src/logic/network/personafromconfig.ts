import { UserProfile } from '@iov/keycontrol';

import { createUserProfile } from '../user';
import { getRuntimeConfiguration } from './runtimeconfiguration';
import { Persona } from '../persona';

const createPersonaFromConfig = async (): Promise<Persona> => {
  // TODO once we support login modify this for loading from db
  const baseProfile: UserProfile = await createUserProfile();

  const { chains } = await getRuntimeConfiguration();

  const persona = new Persona(baseProfile, chains);
  const derivation = 0;
  await persona.generateAccount(derivation);

  return persona;
};

/** Creates Persona if not yet created */
export const getPersonaFromConfig = (): ReturnType<
  typeof createPersonaFromConfig
> => createPersonaFromConfig();
