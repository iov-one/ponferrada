import { createPersona } from './index';
import { mayTestChains } from '../utils/test/testExecutor';
import * as config from './blockchain/chainsConfig/fetchConfig';
import { threeChainsConfig } from './test/chainConfigBuilder';
import { AccountInfo } from './persona';
import { getConfig } from './blockchain/chainsConfig';

describe('logic', (): void => {
  function checkAccount(
    account: AccountInfo,
    name: string,
    availableChainsNames: ReadonlyArray<string>
  ): void {
    expect(account.name).toBe(name);
    expect(account.publicIdentities.size).toBe(availableChainsNames.length);
    expect(Array.from(account.publicIdentities.keys())).toEqual(
      availableChainsNames
    );
  }

  function checkDifferentKeys(
    firstAccount: AccountInfo,
    secondAccount: AccountInfo
  ): void {
    expect(firstAccount.publicIdentities.size).toBe(
      secondAccount.publicIdentities.size
    );

    const keys = Array.from(firstAccount.publicIdentities.keys());

    keys.forEach(chainId => {
      const firstKey = firstAccount.publicIdentities.get(chainId);
      const secondKey = secondAccount.publicIdentities.get(chainId);

      expect(firstKey).not.toEqual(secondKey);
    });
  }

  async function getAvailableChains(): Promise<ReadonlyArray<string>> {
    const config = await getConfig();
    const chainIds = [];
    for (const chain of config.chains) {
      chainIds.push(chain.chainSpec.chainId);
    }

    return chainIds;
  }

  mayTestChains(
    'should fulfill blockchain accounts of just added chains',
    async (): Promise<void> => {
      // GIVEN an entity Persona with two accounts main and saving and exposition to bns and lsk chains
      const fetchConfigMock = jest.spyOn(config, 'fetchConfig');
      fetchConfigMock.mockImplementation(threeChainsConfig);

      const password = 'testPass';
      const persona = await createPersona(password);

      const availableChains = await getAvailableChains();
      let accounts = await persona.accounts();
      expect(accounts.length).toBe(1);
      checkAccount(accounts[0], 'Account 0', availableChains);

      await persona.generateNextAccount();
      accounts = await persona.accounts();
      expect(accounts.length).toBe(2);
      checkAccount(accounts[0], 'Account 0', availableChains);
      checkAccount(accounts[1], 'Account 1', availableChains);

      checkDifferentKeys(accounts[0], accounts[1]);

      // check tokens for each account
      fetchConfigMock.mockRestore();

      // WHEN adding support for ETH
      // THEN the two accounts (main and savings) have a eth blockchain account.
    }
  );
});
