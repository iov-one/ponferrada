import { ChainId } from '@iov/bcp';

import { getPersonaFromConfig } from './personafromconfig';
import * as config from './chainsConfig/fetchConfig';
import { threeChainsConfig } from '../test/chainConfigBuilder';
import { AccountInfo } from '../persona';
import { getConfig } from './chainsConfig';

describe('getPersonaFromConfig', () => {
  function checkAccount(
    account: AccountInfo,
    name: string,
    availableChainsNames: ReadonlyArray<string>
  ): void {
    expect(account.name).toBe(name);
    expect(account.identities.size).toBe(availableChainsNames.length);
    expect(Array.from(account.identities.keys())).toEqual(availableChainsNames);
  }

  function checkDifferentKeys(
    firstAccount: AccountInfo,
    secondAccount: AccountInfo
  ): void {
    expect(firstAccount.identities.size).toEqual(secondAccount.identities.size);

    const keys = Array.from(firstAccount.identities.keys());

    keys.forEach(chainId => {
      const firstKey = firstAccount.identities.get(chainId);
      const secondKey = secondAccount.identities.get(chainId);

      expect(firstKey).not.toEqual(secondKey);
    });
  }

  async function getAvailableChains(): Promise<ReadonlyArray<ChainId>> {
    const config = await getConfig();
    return config.map(config => config.chainId);
  }

  it('works', async () => {
    // GIVEN an entity Persona with two accounts main and saving and exposition to bns and lsk chains
    const fetchConfigMock = jest.spyOn(config, 'fetchConfig');
    fetchConfigMock.mockImplementation(threeChainsConfig);

    const persona = await getPersonaFromConfig();

    const availableChains = await getAvailableChains();
    let accounts = await persona.accounts();
    expect(accounts.length).toEqual(1);
    checkAccount(accounts[0], 'Account 0', availableChains);

    await persona.generateNextAccount();
    accounts = await persona.accounts();
    expect(accounts.length).toEqual(2);
    checkAccount(accounts[0], 'Account 0', availableChains);
    checkAccount(accounts[1], 'Account 1', availableChains);

    checkDifferentKeys(accounts[0], accounts[1]);

    fetchConfigMock.mockRestore();
  });
});
