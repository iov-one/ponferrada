import { MultiChainSigner } from '@iov/core';
import { UserProfile } from '@iov/keycontrol';
import { getUserProfile } from './user';

// This method should be called by the "Create New Persona onSubmit fn"
export const buildPersona = async (
  password: string,
  _accountName: string // eslint-disable-line
): Promise<void> => {
  const userProfile: UserProfile = await getUserProfile(password);
  const signer: MultiChainSigner = new MultiChainSigner(userProfile);

  // load chains info from config file

  // for each chain
  // add chain to signer
  // create identity
  // create address
};
