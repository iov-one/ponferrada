import { UserProfile } from '@iov/keycontrol';

import { createUserProfile } from '../user';
import { getConfig } from '../blockchain/chainsConfig';
import { Persona } from '.';

const createPersonaFromConfig = async (): Promise<Persona> => {
  // TODO once we support login modify this for loading from db
  const baseProfile: UserProfile = await createUserProfile();

  const config = await getConfig();

  const persona = new Persona(baseProfile, config);
  const derivation = 0;
  await persona.generateAccount(derivation);

  return persona;
};

/** Creates Persona if not yet created */
export const getPersonaFromConfig = (): ReturnType<
  typeof createPersonaFromConfig
> => createPersonaFromConfig();
