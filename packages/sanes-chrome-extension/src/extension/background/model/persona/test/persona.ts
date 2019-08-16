import { Store } from "redux";
import { randomString } from "ui-logic";

import { PersonaAcccount, ProcessedTx } from "..";
import { ACCOUNT_STATUS_ROUTE } from "../../../../../routes/paths";
import {
  submitNewAccount,
  submitSecurityHint,
  submitShowPhrase,
} from "../../../../../routes/signup/test/operateSignup";
import * as chromeInternalMsgs from "../../../../../utils/chrome";
import { travelToSignup, whenOnNavigatedToRoute } from "../../../../../utils/test/navigation";
import { PersonaData } from "../../backgroundscript";

export async function processSignup(
  store: Store,
  accountName?: string,
  password?: string,
  hint?: string,
): Promise<React.Component> {
  const signupDom = await travelToSignup(store);

  accountName = accountName || randomString(10);
  password = password || randomString(10);
  hint = hint || randomString(10);

  await submitNewAccount(signupDom, accountName, password);
  await submitShowPhrase(signupDom);
  await submitSecurityHint(signupDom, accountName, hint);

  await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);

  const accountStatusDom = signupDom;

  return accountStatusDom;
}

export const mockPersonaResponse = (
  accounts: PersonaAcccount[] = [],
  mnemonic: string = "",
  txs: ProcessedTx[] = [],
): PersonaData => {
  return { accounts, mnemonic, txs };
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

export const mockClearPersona = (): jest.SpyInstance => {
  return jest.spyOn(chromeInternalMsgs, "clearPersona").mockResolvedValueOnce();
};

export const mockClearDatabase = (): jest.SpyInstance => {
  return jest.spyOn(chromeInternalMsgs, "clearDatabase").mockResolvedValueOnce();
};
