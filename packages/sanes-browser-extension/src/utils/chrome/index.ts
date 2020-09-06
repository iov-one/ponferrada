import {
  GetPersonaResponse,
  IovWindowExtension,
  PersonaData,
} from "../../extension/background/model/backgroundscript";
import { PersonaAcccount } from "../../extension/background/model/persona";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";

export function extensionContext(): boolean {
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.onMessage !== "undefined"
  );
}

export async function getPersonaData(): Promise<GetPersonaResponse> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.getPersonaData();

  return response;
}

export async function createPersona(password: string, mnemonic?: string): Promise<PersonaData> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.createPersona(password, mnemonic);

  return response;
}

export async function loadPersona(password: string): Promise<PersonaData> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.loadPersona(password);

  return response;
}

export async function checkPassword(password: string): Promise<boolean> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.checkPassword(password);

  return response;
}

export async function createAccount(): Promise<readonly PersonaAcccount[]> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.createAccount();

  return response;
}

export function getQueuedRequests(): readonly Request[] {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = extensionWindow.getQueuedRequests();

  return response;
}

export async function getHasStoredPersona(): Promise<boolean> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.hasStoredPersona();

  return response;
}

export async function clearPersona(): Promise<void> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  extensionWindow.clearPersona();
}

export async function clearDatabase(): Promise<void> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  extensionWindow.clearDatabase();
}

export async function getMigrationSignature(): Promise<any> {
  const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
  const response = await extensionWindow.getMigrationSignature();

  return response;
}
