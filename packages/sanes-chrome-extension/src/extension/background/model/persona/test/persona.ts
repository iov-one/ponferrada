import { Store } from 'redux';
import { PersonaAcccount, ProcessedTx } from '..';
import {
  submitNewAccount,
  submitSecurityHint,
  submitShowPhrase,
} from '../../../../../routes/signup/test/operateSignup';
import * as chromeInternalMsgs from '../../../../../utils/chrome';
import { travelToSignup } from '../../../../../utils/test/navigation';
import { randomString } from '../../../../../utils/test/random';
import { PersonaData } from '../../backgroundscript';

export async function submitSignup(
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

  const accountStatusDom = signupDom;

  return accountStatusDom;
}

export const mockPersonaResponse = (
  accounts: PersonaAcccount[] = [],
  mnemonic: string = '',
  txs: ProcessedTx[] = [],
): PersonaData => {
  return { accounts, mnemonic, txs };
};

export const mockGetPersonaData = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, 'getPersonaData').mockResolvedValueOnce(personaData);
};

export const mockCreatePersona = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, 'createPersona').mockResolvedValueOnce(personaData);
};

export const mockLoadPersona = (personaData: PersonaData): void => {
  jest.spyOn(chromeInternalMsgs, 'loadPersona').mockResolvedValueOnce(personaData);
};
