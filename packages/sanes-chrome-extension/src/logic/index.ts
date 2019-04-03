import { TxCodec, Address } from '@iov/bcp';
import { UserProfile } from '@iov/keycontrol';

import { singleton } from '../utils/singleton';

import Account from './account';
import Persona from './persona';
import { createUserProfile } from './user';
import { ChainSpecWithInfo, getFullConfig } from './blockchain/config';
import { codecImplementation } from './blockchain/connection';
import { walletFrom, pathFrom } from './blockchain/wallet';

const generateBlockchainAddressFrom = async (
  userProfile: UserProfile,
  chainSpec: ChainSpecWithInfo,
  derivation: number
): Promise<Address> => {
  const walletId = walletFrom(chainSpec.codec, userProfile.wallets);
  const path = pathFrom(chainSpec.codec, derivation);
  const publicIdentity = await userProfile.createIdentity(
    walletId,
    chainSpec.chainId,
    path
  );

  const codec: TxCodec = codecImplementation(chainSpec.codec);
  const blockchainAddress: Address = codec.identityToAddress(publicIdentity);

  return blockchainAddress;
};

// This method should be called by the "Create New Persona onSubmit fn"
const buildPersona = async (
  password: string,
  accountName: string
): Promise<Persona> => {
  const userProfile: UserProfile = await createUserProfile(password);

  // load chains info from config file
  const config = await getFullConfig();
  const derivation = 0;
  const persona = new Persona();
  const account = new Account(derivation);

  for (const chain of config.chains) {
    const bcAddress = await generateBlockchainAddressFrom(
      userProfile,
      chain.chainSpec,
      derivation
    );
    account.addBlockchainAddress(chain.chainSpec.codecType, bcAddress);
  }

  persona.addAccount(accountName, account);

  return persona;
};

export const createPersona = singleton<typeof buildPersona>(buildPersona);

export const getPersona = (): ReturnType<typeof buildPersona> =>
  createPersona('', '');
