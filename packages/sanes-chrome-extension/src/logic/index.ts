import { UserProfile } from '@iov/keycontrol';

import { singleton } from '../utils/singleton';

import { createUserProfile } from './user';
import { getConfig } from './blockchain/chainsConfig';
import Persona from './persona';
import { getDb } from './user/profile';

// This method should be called by the "Create New Persona onSubmit fn"
const buildPersona = async (
  password: string,
  accountName: string
): Promise<Persona> => {
  // TODO once we support login modify this for loading from db
  const baseProfile: UserProfile = await createUserProfile(password);

  const config = await getConfig();
  // Remove the faucetSpect type because for creating a profile is not needed.
  const derivationInfo = config.chains.map(x => x.chainSpec);

  const persona = new Persona(baseProfile, derivationInfo);
  const derivation = 0;
  const db = await getDb();
  persona.generateAccount(derivation);
  baseProfile.storeIn(db, password);

  // const ethanProfile = new ProfileWithAccounts(baseProfile, derivationInfo);
  // const ethanAccount = await profile.ensureAccount(0, accountName);

  return persona;
};

export const createPersona = singleton<typeof buildPersona>(buildPersona);

export const getPersona = (): ReturnType<typeof buildPersona> =>
  createPersona('', '');
