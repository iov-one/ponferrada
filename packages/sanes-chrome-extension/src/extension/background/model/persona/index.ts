import { MultiChainSigner, SigningServerCore, UserProfile } from '@iov/core';
import { Bip39, Random } from '@iov/crypto';
import { AccountManager } from '../accountManager';
import { StringDb } from '../backgroundscript/db';
import { SigningServer } from '../signingServer';
import { PersonaBuilder } from './personaBuider';

export class Persona {
  private readonly password: string;
  private readonly profile: UserProfile;
  private readonly signer: MultiChainSigner;
  private readonly accountManager: AccountManager;
  private core: SigningServerCore;
  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async create(
    db: StringDb,
    signingServer: SigningServer,
    password: string,
    fixedMnemonic?: string,
  ): Promise<Persona> {
    const entropyBytes = 16;
    const mnemonic = fixedMnemonic || Bip39.encode(await Random.getBytes(entropyBytes)).asString();
    const profile = await PersonaBuilder.createUserProfile(mnemonic);
    const signer = new MultiChainSigner(profile);
    const manager = await PersonaBuilder.createAccountManager(profile);

    // Setup initial account of index 0
    await manager.generateNextAccount();
    await profile.storeIn(db, password);

    return new Persona(password, profile, signer, manager, signingServer);
  }

  public static async load(db: StringDb, signingServer: SigningServer, password: string): Promise<Persona> {
    const profile = await UserProfile.loadFrom(db, password);
    const signer = new MultiChainSigner(profile);
    const manager = await PersonaBuilder.createAccountManager(profile);

    const persona = new Persona(password, profile, signer, manager, signingServer);

    return persona;
  }

  /**
   * The given signer and accountsManager must share the same UserProfile.
   * All changes are automatically saved in db.
   */
  private constructor(
    password: string,
    profile: UserProfile,
    signer: MultiChainSigner,
    accountManager: AccountManager,
    signingServer: SigningServer,
  ) {
    this.password = password;
    this.profile = profile;
    this.signer = signer;
    this.accountManager = accountManager;

    const chainNames = this.accountManager.getChainNames();
    const addressObtainer = this.signer.identityToAddress;
    this.core = new SigningServerCore(
      this.profile,
      this.signer,
      signingServer.getIdentitiesCallback(chainNames, addressObtainer),
      signingServer.signAndPostCallback(),
    );
  }
}
