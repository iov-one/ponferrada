import { getRuntimeConfiguration } from './runtimeconfiguration';
import { AccountsManager } from '../user';
import { getSignerAndProfile } from './signerandprofile';
import { singleton } from '../../utils/singleton';

const createAccountsManagerFromConfig = async (): Promise<AccountsManager> => {
  const { chains } = await getRuntimeConfiguration();

  const { profile } = await getSignerAndProfile();

  const manager = new AccountsManager(profile, chains);
  const derivation = 0;
  await manager.generateAccount(derivation);

  return manager;
};

/**
 * Creates AccountsManager if not yet created.
 *
 * Uses the getSignerAndProfile() singleton internally, such that
 * getSignerAndProfile() and getPersonaFromConfig() always use the same profile.
 */
export const getAccountsManagerFromConfig = singleton<
  typeof createAccountsManagerFromConfig
>(createAccountsManagerFromConfig);
