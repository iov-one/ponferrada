import { CreateAccountResponse } from '../../messages';
import { getCreatedPersona } from '../createPersona';

export async function createAccount(): Promise<CreateAccountResponse> {
  const persona = getCreatedPersona();
  await persona.createAccount();
  const response: CreateAccountResponse = {
    accounts: await persona.getAccounts(),
  };
  return response;
}
