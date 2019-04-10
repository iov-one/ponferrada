import { MultiChainSigner, UserProfile } from '@iov/core';

import { createUserProfile } from '../user';
import { chainConnector } from './runtimeconfiguration';
import { getConfigurationFile, codecTypeFromString } from '../config';

export interface SignerAndProfile {
  readonly signer: MultiChainSigner;
  readonly profile: UserProfile;
}

async function createSignerAndProfile(): Promise<SignerAndProfile> {
  const profile = await createUserProfile();
  const configFile = await getConfigurationFile();

  const signer = new MultiChainSigner(profile);
  for (const chain of configFile.chains) {
    const codecType = codecTypeFromString(chain.chainSpec.codecType);
    const connector = chainConnector(codecType, chain.chainSpec.bootstrapNodes);
    signer.addChain(connector);
  }

  return {
    signer: signer,
    profile: profile,
  };
}

/** Creates MultiChainSigner and connects all chains if not yet created */
export function getSignerAndProfile(): ReturnType<
  typeof createSignerAndProfile
> {
  return createSignerAndProfile();
}
