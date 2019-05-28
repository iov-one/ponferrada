import { JsonRpcResponse } from '@iov/jsonrpc';
import { Persona, PersonaAcccount, ProcessedTx } from '../persona';
import { SigningServer } from '../signingServer';
import { Request } from '../signingServer/requestQueueManager';
import { createBrowserDb, StringDb } from './db';

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
  createPersona: (password: string, mnemonic: string | undefined) => Promise<PersonaData>;
  loadPersona: (password: string) => Promise<PersonaData>;
  createAccount: () => Promise<ReadonlyArray<PersonaAcccount>>;
  getPersonaData: () => Promise<GetPersonaResponse>;
}

export interface PersonaData {
  readonly accounts: ReadonlyArray<PersonaAcccount>;
  readonly mnemonic: string;
  readonly txs: ReadonlyArray<ProcessedTx>;
}

const ALREADY_FOUND_ERR = 'The persona instance is already set. This indicates a bug in the lifecycle.';
const NOT_FOUND_ERR = 'The persona instance is not set. This indicates a bug in the lifecycle.';

export type GetPersonaResponse = PersonaData | null;

class Backgroundscript {
  private persona: Persona | undefined;
  private db: StringDb = createBrowserDb('bs-persona');
  private signingServer = new SigningServer();

  private async createPersona(password: string, mnemonic: string | undefined): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.create(this.db, this.signingServer, password, mnemonic);
    this.signingServer.start(this.persona.getCore());

    return {
      mnemonic: this.persona.mnemonic,
      txs: await this.persona.getTxs(),
      accounts: await this.persona.getAccounts(),
    };
  }

  private async loadPersona(password: string): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.load(this.db, this.signingServer, password);
    this.signingServer.start(this.persona.getCore());

    return {
      mnemonic: this.persona.mnemonic,
      txs: await this.persona.getTxs(),
      accounts: await this.persona.getAccounts(),
    };
  }

  private async createAccount(): Promise<ReadonlyArray<PersonaAcccount>> {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    await this.persona.createAccount(this.db);

    return await this.persona.getAccounts();
  }

  private async getPersonaData(): Promise<GetPersonaResponse> {
    if (!this.persona) {
      return null;
    }

    return {
      mnemonic: this.persona.mnemonic,
      txs: await this.persona.getTxs(),
      accounts: await this.persona.getAccounts(),
    };
  }

  public clearPersona(): void {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    this.persona.destroy();
    this.persona = undefined;

    this.signingServer.shutdown();
  }

  public registerActionsInBackground(): void {
    (window as IovWindowExtension).getQueuedRequests = this.signingServer.getPendingRequests;
    (window as IovWindowExtension).createPersona = this.createPersona;
    (window as IovWindowExtension).loadPersona = this.loadPersona;
    (window as IovWindowExtension).createAccount = this.createAccount;
    (window as IovWindowExtension).getPersonaData = this.getPersonaData;
  }

  public handleRequestMessage(
    message: any, //eslint-disable-line
    sender: chrome.runtime.MessageSender,
  ): Promise<JsonRpcResponse> {
    return this.signingServer.handleRequestMessage(message, sender);
  }
}

export default Backgroundscript;
