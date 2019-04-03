import { createPersona } from './index';
import { mayTestChains } from '../utils/test/testExecutor';

describe('logic', () => {
  mayTestChains('should get a Persona', async () => {
    const password = 'test-password';
    const accountName = 'test-account';
    const account = await createPersona(password, accountName);
    expect(account.derivation).toEqual(0);
    expect(account.name).toEqual(accountName);

    expect(account.chains.length).toEqual(4);
    account.chains.map(acct => {
      // some basic checks...
      expect(acct.address).toBeDefined();
      expect(acct.address.length).toBeGreaterThanOrEqual(6);
    });
  });
});
