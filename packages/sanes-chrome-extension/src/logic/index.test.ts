import { createPersona } from './index';
import Persona from './persona';
import { mayTestChains } from '../utils/test/testExecutor';

describe('logic', () => {
  mayTestChains('should get a Persona', async () => {
    const password = 'test-password';
    const accountName = 'test-account';
    const persona: Persona = await createPersona(password, accountName);
    const accounts = persona.accounts;
    expect(accounts.has(accountName)).toEqual(true);
    const account = accounts.get(accountName);
    if (!account) {
      throw new Error('Account should not be undefined');
    }

    expect(account.blockchainAddresses.size).toEqual(4);
  });
});
