import { Algorithm, ChainId } from '@iov/bcp';
import { HdPaths } from '@iov/keycontrol';

import { PersonaBuilder } from '../persona/personaBuider';
import { AccountManager, AccountManagerChainConfig } from './index';

describe('AccountManager', () => {
  const defaultMnemonic = 'adapt true travel equip february unhappy junk head warrior recall moral escape';

  const chain1: AccountManagerChainConfig = {
    algorithm: Algorithm.Ed25519,
    chainId: 'test-chain-1' as ChainId,
    derivePath: x => HdPaths.iov(x),
  };

  const chain2: AccountManagerChainConfig = {
    algorithm: Algorithm.Secp256k1,
    chainId: 'test-chain-2' as ChainId,
    derivePath: x => HdPaths.ethereum(x),
  };

  it('can be created', async () => {
    const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
    const manager = new AccountManager(userProfile, []);
    expect(manager).toBeTruthy();
  });

  describe('accounts', () => {
    it('returns an empty list of accounts by default', async () => {
      const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
      const manager = new AccountManager(userProfile, []);
      expect(await manager.accounts()).toEqual([]);
    });
  });

  describe('generateNextAccount', () => {
    it('does not change accounts for empty chains list', async () => {
      const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
      const manager = new AccountManager(userProfile, []);
      await manager.generateNextAccount();
      expect(await manager.accounts()).toEqual([]);
    });

    it('generates one account with one identity when chains list has one element', async () => {
      const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
      const manager = new AccountManager(userProfile, [chain1]);
      await manager.generateNextAccount();
      const accounts = await manager.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0]).toMatchObject({
        index: 0,
        identities: [{ chainId: chain1.chainId }],
      });
    });

    it('generates one account with two identities when chains list has two elements', async () => {
      const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
      const manager = new AccountManager(userProfile, [chain1, chain2]);
      await manager.generateNextAccount();
      const accounts = await manager.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0]).toMatchObject({
        index: 0,
        identities: [{ chainId: chain1.chainId }, { chainId: chain2.chainId }],
      });
    });

    it('can be used multiple times', async () => {
      const userProfile = await PersonaBuilder.createUserProfile(defaultMnemonic);
      const manager = new AccountManager(userProfile, [chain1]);
      await manager.generateNextAccount();
      await manager.generateNextAccount();
      await manager.generateNextAccount();
      const accounts = await manager.accounts();
      expect(accounts.length).toEqual(3);
      expect(accounts[0]).toMatchObject({
        index: 0,
        identities: [{ chainId: chain1.chainId }],
      });
      expect(accounts[1]).toMatchObject({
        index: 1,
        identities: [{ chainId: chain1.chainId }],
      });
      expect(accounts[2]).toMatchObject({
        index: 2,
        identities: [{ chainId: chain1.chainId }],
      });
    });
  });
});
