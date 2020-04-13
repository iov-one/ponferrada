import { Amount, ChainId } from "@iov/bcp";
import { JsonRpcResponse } from "@iov/jsonrpc";

import { Persona, PersonaAcccount } from "../persona";
import RequestsHandler from "../requestsHandler";
import { Request } from "../requestsHandler/requestQueueManager";
import { Db } from "./db";

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => readonly Request[];
  createPersona: (password: string, mnemonic: string | undefined) => Promise<PersonaData>;
  loadPersona: (password: string) => Promise<PersonaData>;
  checkPassword: (password: string) => Promise<boolean>;
  clearPersona: () => void;
  createAccount: () => Promise<readonly PersonaAcccount[]>;
  getPersonaData: () => Promise<GetPersonaResponse>;
  hasStoredPersona: () => Promise<boolean>;
  clearDatabase: () => Promise<void>;
}

export interface PersonaData {
  readonly mnemonic: string;
  readonly connectedChains: readonly ChainId[];
  readonly getAccounts: () => Promise<readonly PersonaAcccount[]>;
  readonly getBalances: () => Promise<readonly (readonly Amount[])[]>;
  readonly getNames: () => Promise<readonly string[]>;
}

const ALREADY_FOUND_ERR = "The persona instance is already set. This indicates a bug in the lifecycle.";
const NOT_FOUND_ERR = "The persona instance is not set. This indicates a bug in the lifecycle.";

export type GetPersonaResponse = PersonaData | null;

class Backgroundscript {
  private persona: Persona | undefined;
  private readonly db = new Db();
  private requestsHandler = new RequestsHandler();

  private async createPersona(password: string, mnemonic: string | undefined): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.create(
      this.db.getDb(),
      password,
      signer => this.requestsHandler.makeAuthorizationCallbacks(signer),
      mnemonic,
    );
    this.requestsHandler.start(this.persona.signingServer);

    const persona = this.persona;

    const response = {
      mnemonic: this.persona.mnemonic,
      connectedChains: this.persona.connectedChains,
      getAccounts: () => persona.getAccounts(),
      getBalances: () => persona.getBalances(),
      getNames: () => persona.getNames(),
    };

    return response;
  }

  private async loadPersona(password: string): Promise<PersonaData> {
    if (this.persona) throw new Error(ALREADY_FOUND_ERR);
    this.persona = await Persona.load(this.db.getDb(), password, signer =>
      this.requestsHandler.makeAuthorizationCallbacks(signer),
    );
    this.requestsHandler.start(this.persona.signingServer);

    const persona = this.persona;

    return {
      mnemonic: this.persona.mnemonic,
      connectedChains: this.persona.connectedChains,
      getAccounts: () => persona.getAccounts(),
      getBalances: () => persona.getBalances(),
      getNames: () => persona.getNames(),
    };
  }

  private async checkPassword(password: string): Promise<boolean> {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);

    const persona = await Persona.load(this.db.getDb(), password, signer =>
      this.requestsHandler.makeAuthorizationCallbacks(signer),
    );

    if (persona.mnemonic === this.persona.mnemonic) return true;
    return false;
  }

  private async createAccount(): Promise<readonly PersonaAcccount[]> {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    await this.persona.createAccount(this.db.getDb());

    return await this.persona.getAccounts();
  }

  private async getPersonaData(): Promise<GetPersonaResponse> {
    if (!this.persona) {
      return null;
    }

    const persona = this.persona;

    return {
      mnemonic: this.persona.mnemonic,
      connectedChains: this.persona.connectedChains,
      getAccounts: () => persona.getAccounts(),
      getBalances: () => persona.getBalances(),
      getNames: () => persona.getNames(),
    };
  }

  private async hasStoredPersona(): Promise<boolean> {
    return this.db.hasPersona();
  }

  public clearPersona(): void {
    if (!this.persona) throw new Error(NOT_FOUND_ERR);
    this.persona.destroy();
    this.persona = undefined;

    this.requestsHandler.shutdown();
  }

  public async clearDatabase(): Promise<void> {
    await this.db.clear();
  }

  public registerActionsInBackground(windowExtension: IovWindowExtension): void {
    windowExtension.getQueuedRequests = () => this.requestsHandler.getPendingRequests();
    windowExtension.createPersona = (pss, mn) => this.createPersona(pss, mn);
    windowExtension.loadPersona = pss => this.loadPersona(pss);
    windowExtension.checkPassword = pss => this.checkPassword(pss);
    windowExtension.createAccount = () => this.createAccount();
    windowExtension.getPersonaData = () => this.getPersonaData();
    windowExtension.hasStoredPersona = () => this.hasStoredPersona();
    windowExtension.clearPersona = () => this.clearPersona();
    windowExtension.clearDatabase = () => this.clearDatabase();
  }

  public handleRequestMessage(message: any, sender: chrome.runtime.MessageSender): Promise<JsonRpcResponse> {
    return this.requestsHandler.handleRequestMessage(message, sender);
  }
}

export default Backgroundscript;
