import { createPersona } from './index';
import { mayTestChains } from '../utils/test/testExecutor';

import * as config from './blockchain/chainsConfig/fetchConfig';
import { threeChainsConfig } from './test/chainConfigBuilder';

describe('logic', () => {
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
    async () => {
      // GIVEN an entity Persona with two accounts main and saving and exposition to bns and lsk chains
      const fetchConfigMock = jest.spyOn(config, 'fetchConfig');
      fetchConfigMock.mockImplementation(threeChainsConfig);

      const password = 'testPass';
      const accountName = 'main';
      const persona = await createPersona(password, accountName);

      expect(persona.accounts.length).toBe(1);
      expect(persona.accounts[0]).toBe('account0');
      fetchConfigMock.mockRestore();

      // WHEN adding support for ETH
      // THEN the two accounts (main and savings) have a eth blockchain account.
    }
  );
});
