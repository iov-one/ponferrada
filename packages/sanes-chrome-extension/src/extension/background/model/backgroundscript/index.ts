import { JsonRpcResponse } from '@iov/jsonrpc';
import { Persona, PersonaAcccount, ProcessedTx } from '../persona';
import SigningServer from '../signingServer';
import { Request } from '../signingServer/requestQueueManager';
import { Db } from './db';

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
  createPersona: (password: string, mnemonic: string | undefined) => Promise<PersonaData>;
  loadPersona: (password: string) => Promise<PersonaData>;
  clearPersona: () => void;
  createAccount: () => Promise<ReadonlyArray<PersonaAcccount>>;
  getPersonaData: () => Promise<GetPersonaResponse>;
  hasStoredPersona: () => Promise<boolean>;
  clearDatabase: () => Promise<void>;
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
  private readonly db = new Db();
  private signingServer = new SigningServer();

  private async createPersona(password: string, mnemonic: string | undefined): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.create(this.db.getDb(), this.signingServer, password, mnemonic);
    this.signingServer.start(this.persona.getCore());

    const response = {
      mnemonic: this.persona.mnemonic,
      txs: await this.persona.getTxs(),
      accounts: await this.persona.getAccounts(),
    };

    return response;
  }

  private async loadPersona(password: string): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.load(this.db.getDb(), this.signingServer, password);
    this.signingServer.start(this.persona.getCore());

    return {
      mnemonic: this.persona.mnemonic,
      txs: await this.persona.getTxs(),
      accounts: await this.persona.getAccounts(),
    };
  }

  private async createAccount(): Promise<ReadonlyArray<PersonaAcccount>> {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    await this.persona.createAccount(this.db.getDb());

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

  private async hasStoredPersona(): Promise<boolean> {
    return this.db.hasPersona();
  }

  public clearPersona(): void {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    this.persona.destroy();
    this.persona = undefined;

    this.signingServer.shutdown();
  }

  public async clearDatabase(): Promise<void> {
    await this.db.clear();
  }

  public registerActionsInBackground(windowExtension: IovWindowExtension): void {
    windowExtension.getQueuedRequests = () => this.signingServer.getPendingRequests();
    windowExtension.createPersona = (pss, mn) => this.createPersona(pss, mn);
    windowExtension.loadPersona = pss => this.loadPersona(pss);
    windowExtension.createAccount = () => this.createAccount();
    windowExtension.getPersonaData = () => this.getPersonaData();
    windowExtension.hasStoredPersona = () => this.hasStoredPersona();
    windowExtension.clearPersona = () => this.clearPersona();
    windowExtension.clearDatabase = () => this.clearDatabase();
  }

  public handleRequestMessage(message: any, sender: chrome.runtime.MessageSender): Promise<JsonRpcResponse> {
    return this.signingServer.handleRequestMessage(message, sender);
  }
}

export default Backgroundscript;
