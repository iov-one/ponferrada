import { MultiChainSigner } from '@iov/core';

import { chainConnector, getRuntimeConfiguration } from '../config';
import { AccountsManager, createUserProfile } from '../user';
import { Persona } from './persona';
import { singleton } from '../../utils/singleton';

/**
 * Creates a new Persona instance.
 *
 * This function does everything that cannot be done in a constructor
 * (because a constructor is synchonous): reading configs, connecting to the network,
 * creating accounts.
 */
export async function createPersona(): Promise<Persona> {
  const { chains } = await getRuntimeConfiguration();

  const profile = await createUserProfile();
  const signer = new MultiChainSigner(profile);

  // connect chains
  for (const chain of chains) {
    const connector = chainConnector(chain.codecType, chain.bootstrapNodes);
    signer.addChain(connector);
  }

  const manager = new AccountsManager(profile, chains);

  // Setup accounts
  await manager.generateAccount(0);

  return new Persona(signer, manager);
}

// TODO: Remove this when https://github.com/iov-one/ponferrada/pull/85 is done
export const getGlobalPersona = singleton<typeof createPersona>(createPersona);
