import { Persona } from '../persona';
import { SigningServer } from '../signingServer';
import { Request } from '../signingServer/requestHandler';
import { createBrowserDb, StringDb } from './db';

export interface IovWindowExtension extends Window {
  getQueuedRequests: () => ReadonlyArray<Request>;
  createPersona: (password: string, mnemonic: string | undefined) => Promise<void>;
  loadPersona: (password: string) => Promise<void>;
}

class Backgroundscript {
  private persona: Persona | undefined;
  private db: StringDb = createBrowserDb('bs-persona');
  private signingServer = new SigningServer();

  private async createPersona(password: string, mnemonic: string | undefined): Promise<void> {
    if (this.persona) {
      throw new Error('The persona instance is already set. This indicates a bug in the lifecycle.');
    }
    this.persona = await Persona.create(this.db, this.signingServer, password, mnemonic);
    this.signingServer.start(this.persona.getCore());
  }

  private async loadPersona(password: string): Promise<void> {
    if (this.persona) {
      throw new Error('The persona instance is already set. This indicates a bug in the lifecycle.');
    }
    this.persona = await Persona.load(this.db, this.signingServer, password);
    this.signingServer.start(this.persona.getCore());
  }

  public clearPersona(): void {
    if (!this.persona) {
      throw new Error('The persona instance is unset. This indicates a bug in the lifecycle.');
    }
    this.persona.destroy();
    this.persona = undefined;

    this.signingServer.shutdown();
  }

  public registerActionsInBackground(): void {
    (window as IovWindowExtension).getQueuedRequests = this.signingServer.getPendingRequests;
    (window as IovWindowExtension).createPersona = this.createPersona;
    (window as IovWindowExtension).loadPersona = this.loadPersona;
  }
}

export default Backgroundscript;
