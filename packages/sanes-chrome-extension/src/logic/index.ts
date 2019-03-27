import { MultiChainSigner } from '@iov/core';
import { UserProfile } from '@iov/keycontrol';
import { getUserProfile } from './user';
import { getConfig, ChainConfig } from '../utils/config';
import { singleton } from '../utils/singleton';
import Persona from './persona';
import Account from './account';

const buildBlockchainAccountFrom = (...args: any[]): string => {
  return 'moe';
};

// This method should be called by the "Create New Persona onSubmit fn"
const buildPersona = async (
  password: string,
  accountName: string
): Promise<Persona> => {
  const userProfile: UserProfile = await getUserProfile(password);
  const signer: MultiChainSigner = new MultiChainSigner(userProfile);

  // load chains info from config file
  const config = await getConfig();
  const derivation = 0;
  const persona = new Persona();
  const account = new Account(derivation);

  config.chains.forEach((chain: ChainConfig) => {
    const bcAddress = generateBlockchainAddressFrom(chain);
    account.addBlockchainAddress(chain.chainSpec.codecType, bcAddress);
    // Get connection from adding chain to signer
    // get chainId from connection
    // Add identity to profile using chainId
  });

  persona.addAccount(accountName, account);

  return persona;
};

export const getPersona = singleton<typeof buildPersona>(buildPersona);
