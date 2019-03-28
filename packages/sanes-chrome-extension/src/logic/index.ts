import { MultiChainSigner } from '@iov/core';
import { UserProfile } from '@iov/keycontrol';
import { getUserProfile } from './user';
import { getConfig, ChainSpec } from '../utils/config';
import { singleton } from '../utils/singleton';
import Persona from './persona';
import Account from './account';
import {
  codecFromString,
  chainConnector,
  codecImplementation,
} from './blockchain/connection';
import { ChainConnector, TxCodec, Address } from '@iov/bcp';
import { walletFrom, pathFrom } from './blockchain/wallet';

const generateBlockchainAddressFrom = async (
  userProfile: UserProfile,
  signer: MultiChainSigner,
  chainSpec: ChainSpec,
  derivation: number
): Promise<Address> => {
  const nodes = chainSpec.bootstrapNodes;
  const codecType = codecFromString(chainSpec.codecType);

  const connector: ChainConnector = chainConnector(codecType, nodes);
  const { connection } = await signer.addChain(connector);
  const chainId = connection.chainId();
  const walletId = walletFrom(codecType, userProfile.wallets);
  const path = pathFrom(codecType, derivation);
  const publicIdentity = await userProfile.createIdentity(
    walletId,
    chainId,
    path
  );

  const codec: TxCodec = codecImplementation(codecType);
  const blockchainAddress: Address = codec.identityToAddress(publicIdentity);

  return blockchainAddress;
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

  for (const chain of config.chains) {
    const bcAddress = await generateBlockchainAddressFrom(
      userProfile,
      signer,
      chain.chainSpec,
      derivation
    );
    account.addBlockchainAddress(chain.chainSpec.codecType, bcAddress);
  }

  persona.addAccount(accountName, account);

  return persona;
};

export const getPersona = singleton<typeof buildPersona>(buildPersona);
