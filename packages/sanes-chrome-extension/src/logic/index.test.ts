import { createPersona } from './index';
import { mayTestChains } from '../utils/test/testExecutor';

import * as config from './blockchain/chainsConfig/fetchConfig';
import { threeChainsConfig } from './test/chainConfigBuilder';

describe('logic', (): void => {
  /*mayTestChains('should get a Persona', async () => {
    const password = 'test-password';
    const accountName = 'test-account';
    const persona = await createPersona(password, accountName);
    const account = persona.accounts;
    expect(persona.derivation).toEqual(0);
    expect(account.name).toEqual(accountName);

    expect(account.chains.length).toEqual(4);
    account.chains.forEach(acct => {
      // some basic checks...
      expect(acct.address).toBeDefined();
      expect(acct.address.length).toBeGreaterThanOrEqual(6);
    });
  });*/
  mayTestChains(
    'should fulfill blockchain accounts of just added chains',
    async (): Promise<void> => {
      // GIVEN an entity Persona with two accounts main and saving and exposition to bns and lsk chains
      const fetchConfigMock = jest.spyOn(config, 'fetchConfig');
      fetchConfigMock.mockImplementation(threeChainsConfig);

      const password = 'testPass';
      const accountName = 'main';
      const persona = await createPersona(password, accountName);
      let accounts = await persona.accounts();
      expect(accounts.length).toBe(1);
      expect(accounts[0]).toBe('Account 0');

      await persona.generateNextAccount();
      accounts = await persona.accounts();
      expect(accounts.length).toBe(2);
      expect(accounts[0]).toBe('Account 0');
      expect(accounts[1]).toBe('Account 1');

      fetchConfigMock.mockRestore();

      // WHEN adding support for ETH
      // THEN the two accounts (main and savings) have a eth blockchain account.
    }
  );
});
