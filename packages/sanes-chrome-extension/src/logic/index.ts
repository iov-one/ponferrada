import { UserProfile } from '@iov/keycontrol';

import { singleton } from '../utils/singleton';

import { createUserProfile } from './user';
import { getConfig } from './blockchain/chainsConfig';
import Persona from './persona';
import { getDefaultDb } from './user/profile';

// This method should be called by the "Create New Persona onSubmit fn"
const buildAndStorePersona = async (password: string): Promise<Persona> => {
  // TODO once we support login modify this for loading from db
  const baseProfile: UserProfile = await createUserProfile();

  const config = await getConfig();
  // Remove the faucetSpect type because for creating a profile is not needed.
  const derivationInfo = config.chains.map(x => x.chainSpec);

  const persona = new Persona(baseProfile, derivationInfo);
  const derivation = 0;
  await persona.generateAccount(derivation);

  const db = await getDefaultDb();
  baseProfile.storeIn(db, password);

  return persona;
};

export const createPersona = singleton<typeof buildAndStorePersona>(
  buildAndStorePersona
);

export const getPersona = (): ReturnType<typeof buildAndStorePersona> =>
  createPersona('');
