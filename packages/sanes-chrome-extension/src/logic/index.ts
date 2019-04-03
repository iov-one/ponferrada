import { UserProfile } from '@iov/keycontrol';

import { singleton } from '../utils/singleton';

import { Account, ProfileWithAccounts, AccountInfo } from './account';
import { createUserProfile } from './user';
import { getFullConfig } from './blockchain/config';

// This method should be called by the "Create New Persona onSubmit fn"
const buildPersona = async (
  password: string,
  accountName: string
): Promise<Account<AccountInfo>> => {
  // this assumes no database for this persona is existing?
  // we need some load clause
  const baseProfile: UserProfile = await createUserProfile(password);

  // load chains info from config file
  const config = await getFullConfig();
  const derivationInfo = config.chains.map(x => x.chainSpec);

  // Do we need the Persona?
  // I prefer to have all the info based on the wrapped profile.
  // But we may want some more helper methods (memory caching)
  // const persona = new Persona();
  const profile = new ProfileWithAccounts(baseProfile, derivationInfo);
  const account = await profile.ensureAccount(0, accountName);
  return account;
};

export const createPersona = singleton<typeof buildPersona>(buildPersona);

export const getPersona = (): ReturnType<typeof buildPersona> =>
  createPersona('', '');
