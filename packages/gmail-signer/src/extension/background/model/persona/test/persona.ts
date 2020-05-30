import { Amount, ChainId } from "@iov/bcp";
import { randomString } from "ui-logic";

import { PersonaAcccount } from "..";
import {
  submitNewWallet,
  submitSecurityHint,
  submitShowWords,
} from "../../../../../routes/create-wallet/test/operateCreateWallet";
import { WALLET_STATUS_ROUTE } from "../../../../../routes/paths";
import * as chromeInternalMsgs from "../../../../../utils/chrome";
import { travelToCreateWallet, whenOnNavigatedToRoute } from "../../../../../utils/test/navigation";
import { PersonaData } from "../../backgroundscript";

export async function processCreateWallet(
  password: string = randomString(10),
  hint: string = randomString(10),
): Promise<React.Component> {
  const createWalletDom = await travelToCreateWallet();

  await submitNewWallet(createWalletDom, password);
  await submitShowWords(createWalletDom);
  await submitSecurityHint(createWalletDom, hint);

  await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);

  const accountStatusDom = createWalletDom;

  return accountStatusDom;
}

export const mockPersonaResponse = (
  mnemonic = "",
  connectedChains: ChainId[] = [],
  accounts: PersonaAcccount[] = [],
  balances: Amount[][] = [],
  starnames: string[] = [],
): PersonaData => {
  const getAccounts = (): Promise<readonly PersonaAcccount[]> => new Promise(resolve => resolve(accounts));
  const getBalances = (): Promise<readonly (readonly Amount[])[]> =>
    new Promise(resolve => resolve(balances));
  const getStarnames = (): Promise<readonly string[]> => new Promise(resolve => resolve(starnames));

  return { mnemonic, connectedChains, getAccounts, getBalances, getStarnames };
};

export const mockGetPersonaData = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, "getPersonaData").mockResolvedValueOnce(personaData);
};

export const mockCreatePersona = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, "createPersona").mockResolvedValueOnce(personaData);
};

export const mockLoadPersona = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, "loadPersona").mockResolvedValueOnce(personaData);
};

export const mockcheckPassword = (): void => {
  jest.spyOn(chromeInternalMsgs, "checkPassword").mockResolvedValueOnce(true);
};

export const mockClearPersona = (): jest.SpyInstance => {
  return jest.spyOn(chromeInternalMsgs, "clearPersona").mockResolvedValueOnce();
};

export const mockClearPersonaWithException = (): void => {
  jest.spyOn(chromeInternalMsgs, "clearPersona").mockRejectedValueOnce("error during persona clearing");
};

export const mockClearDatabase = (): jest.SpyInstance => {
  return jest.spyOn(chromeInternalMsgs, "clearDatabase").mockResolvedValueOnce();
};
