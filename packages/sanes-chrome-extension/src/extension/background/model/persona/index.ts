import { Amount, isSendTransaction } from '@iov/bcp';
import { MultiChainSigner, SignedAndPosted, SigningServerCore, UserProfile } from '@iov/core';
import { Bip39, Random } from '@iov/crypto';
import { Encoding } from '@iov/encoding';
import { ReadonlyDate } from 'readonly-date';
import { transactionsUpdater } from '../../updaters/appUpdater';
import { AccountManager } from '../accountManager';
import { StringDb } from '../backgroundscript/db';
import { SigningServer } from '../signingServer';
import { PersonaBuilder } from './personaBuider';

function isNonNull<T>(t: T | null): t is T {
  return t !== null;
}

/**
 * A transaction signed by the user of the extension.
 *
 * All fields must be losslessly JSON serializable/deserializable to allow
 * messaging between background script and UI.
 */
export interface ProcessedTx {
  readonly id: string;
  readonly recipient: string;
  readonly signer: string;
  readonly amount: Amount;
  readonly memo?: string;
  readonly time: string;
  /** If error is null, the transactin succeeded  */
  readonly error: string | null;
}

/**
 * An account
 *
 * All fields must be losslessly JSON serializable/deserializable to allow
 * messaging between background script and UI.
 */
export interface PersonaAcccount {
  /** human readable address or placeholder text */
  readonly label: string;
}

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

    this.subscribeToTxUpdates(transactionsUpdater);
  }

  private subscribeToTxUpdates(notifyApp: (transactions: ReadonlyArray<ProcessedTx>) => void): void {
    this.core.signedAndPosted.updates.subscribe({
      next: async signedAndPosted => {
        const processed = await Promise.all(signedAndPosted.map(s => this.processTransaction(s)));
        const filtered = processed.filter(isNonNull);
        notifyApp(filtered);
      },
    });
  }

  /**
   * We keep this async for now to allow fetching IOV names
   */
  private async processTransaction(t: SignedAndPosted): Promise<ProcessedTx | null> {
    if (!isSendTransaction(t.transaction)) {
      // cannot process
      return null;
    }

    return {
      time: new ReadonlyDate(ReadonlyDate.now()).toLocaleString(),
      id: t.postResponse.transactionId,
      recipient: t.transaction.recipient,
      signer: Encoding.toHex(t.transaction.creator.pubkey.data),
      memo: t.transaction.memo,
      amount: t.transaction.amount,
      error: null,
    };
  }

  public getCore(): SigningServerCore {
    return this.core;
  }

  public destroy(): void {
    this.signer.shutdown();
  }

  public async createAccount(db: StringDb): Promise<void> {
    await this.accountManager.generateNextAccount();
    await this.profile.storeIn(db, this.password);
  }

  public async getAccounts(): Promise<ReadonlyArray<PersonaAcccount>> {
    const accounts = await this.accountManager.accounts();

    return accounts.map(account => {
      // TODO here: query network to get human readable address
      return {
        label: `Account ${account.index}`,
      };
    });
  }

  public get mnemonic(): string {
    const wallets = this.profile.wallets.value;
    const mnemonics = new Set(wallets.map(info => this.profile.printableSecret(info.id)));

    if (mnemonics.size !== 1) {
      throw new Error('Found multiple different mnemoics in different wallets. This is not supported.');
    }

    return mnemonics.values().next().value;
  }

  public async getTxs(): Promise<ReadonlyArray<ProcessedTx>> {
    if (!this.core) {
      return [];
    }

    const processed = await Promise.all(this.core.signedAndPosted.value.map(s => this.processTransaction(s)));
    const filtered = processed.filter(isNonNull);
    return filtered;
  }
}
