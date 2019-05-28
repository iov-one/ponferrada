import { MultiChainSigner } from '@iov/core';
import { Ed25519HdWallet, Secp256k1HdWallet, UserProfile } from '@iov/keycontrol';
import { AccountManager, AccountManagerChainConfig } from '../accountManager';
import {
  algorithmForCodec,
  chainConnector,
  codecTypeFromString,
  ConfigurationFile,
  getConfigurationFile,
  pathBuilderForCodec,
} from './config';

export class PersonaBuilder {
  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async createAccountManager(
    profile: UserProfile,
    signer: MultiChainSigner,
  ): Promise<AccountManager> {
    const config: ConfigurationFile = await getConfigurationFile();

    const managerChains: AccountManagerChainConfig[] = [];
    for (const chainSpec of config.chains.map(chain => chain.chainSpec)) {
      const codecType = codecTypeFromString(chainSpec.codecType);
      const connector = chainConnector(codecType, chainSpec.bootstrapNodes);
      const { connection } = await signer.addChain(connector);
      managerChains.push({
        chainId: connection.chainId(),
        algorithm: algorithmForCodec(codecType),
        derivePath: pathBuilderForCodec(codecType),
      });
    }

    const accountManager = new AccountManager(profile, managerChains);

    return accountManager;
  }

  public static async createUserProfile(mnemonic: string): Promise<UserProfile> {
    const edKeyring = Ed25519HdWallet.fromMnemonic(mnemonic);
    const secKeyring = Secp256k1HdWallet.fromMnemonic(mnemonic);
    const profile = new UserProfile();
    profile.addWallet(edKeyring);
    profile.addWallet(secKeyring);

    return profile;
  }
}
