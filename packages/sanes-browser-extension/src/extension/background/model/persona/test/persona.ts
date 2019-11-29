import { Amount } from "@iov/bcp";
import { randomString } from "ui-logic";

import { PersonaAcccount, ProcessedTx } from "..";
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
  accounts: PersonaAcccount[] = [],
  mnemonic: string = "",
  txs: ProcessedTx[] = [],
  balances: Amount[][] = [],
): PersonaData => {
  return { accounts, mnemonic, txs, balances };
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
