import { getRuntimeConfiguration } from './runtimeconfiguration';
import { Persona } from '../persona';
import { getSignerAndProfile } from './signerandprofile';

const createPersonaFromConfig = async (): Promise<Persona> => {
  const { chains } = await getRuntimeConfiguration();

  const { profile } = await getSignerAndProfile();

  const persona = new Persona(profile, chains);
  const derivation = 0;
  await persona.generateAccount(derivation);

  return persona;
};

/**
 * Creates Persona if not yet created.
 *
 * Uses the getSignerAndProfile() singleton internally, such that
 * getSignerAndProfile() and getPersonaFromConfig() always use the same profile.
 */
export const getPersonaFromConfig = (): ReturnType<
  typeof createPersonaFromConfig
> => createPersonaFromConfig();
