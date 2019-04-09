import { Algorithm, ChainId } from '@iov/bcp';
import { bnsCodec } from '@iov/bns';
import { HdPaths } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';

import { Persona } from '.';
import { createUserProfile } from '../user';
import { EnhancedChainSpec } from '../blockchain/chainsConfig';

describe('Persona', () => {
  const chain1: EnhancedChainSpec = {
    algorithm: Algorithm.Ed25519,
    bootstrapNodes: [],
    chainId: 'test-chain-1' as ChainId,
    codec: bnsCodec,
    codecType: 'bns',
    derivePath: x => HdPaths.iov(x),
  };

  const chain2: EnhancedChainSpec = {
    algorithm: Algorithm.Secp256k1,
    bootstrapNodes: [],
    chainId: 'test-chain-2' as ChainId,
    codec: ethereumCodec,
    codecType: 'eth',
    derivePath: x => HdPaths.ethereum(x),
  };

  it('can be created', async () => {
    const userProfile = await createUserProfile();
    const persona = new Persona(userProfile, []);
    expect(persona).toBeTruthy();
  });

  describe('mnemonic', () => {
    it('returns a given mnemonic', async () => {
      const mnenomic =
        'pulse ankle attack minute install ceiling arena bargain primary degree system sense';
      const userProfile = await createUserProfile(mnenomic);
      const persona = new Persona(userProfile, []);
      expect(persona.mnemonic()).toEqual(mnenomic);
    });
  });

  describe('accounts', () => {
    it('returns an empty list of accounts by default', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, []);
      expect(await persona.accounts()).toEqual([]);
    });
  });

  describe('generateAccount', () => {
    it('does not change accounts for empty chains list', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, []);
      await persona.generateAccount(0);
      expect(await persona.accounts()).toEqual([]);
    });

    it('generates one account with one identity when chains list has one element', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1]);
      await persona.generateAccount(0);
      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].identities.size).toEqual(1);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId]
      );
    });

    it('generates one account with two identities when chains list has two elements', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1, chain2]);
      await persona.generateAccount(0);
      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].identities.size).toEqual(2);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId, chain2.chainId]
      );
    });
  });

  describe('generateNextAccount', () => {
    it('does not change accounts for empty chains list', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, []);
      await persona.generateNextAccount();
      expect(await persona.accounts()).toEqual([]);
    });

    it('generates one account with one identity when chains list has one element', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1]);
      await persona.generateNextAccount();
      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].identities.size).toEqual(1);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId]
      );
    });

    it('generates one account with two identities when chains list has two elements', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1, chain2]);
      await persona.generateNextAccount();
      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].identities.size).toEqual(2);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId, chain2.chainId]
      );
    });

    it('can be used multiple times', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1]);
      await persona.generateNextAccount();
      await persona.generateNextAccount();
      await persona.generateNextAccount();
      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(3);
      expect(accounts[0].identities.size).toEqual(1);
      expect(accounts[1].identities.size).toEqual(1);
      expect(accounts[2].identities.size).toEqual(1);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId]
      );
      expect(Array.from(accounts[1].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId]
      );
      expect(Array.from(accounts[2].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId]
      );
    });
  });

  describe('addChain', () => {
    it('generates missing identities for one account when adding a chain', async () => {
      const userProfile = await createUserProfile();
      const persona = new Persona(userProfile, [chain1]);
      await persona.generateNextAccount();

      await persona.addChain(chain2);

      const accounts = await persona.accounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].identities.size).toEqual(2);
      expect(Array.from(accounts[0].identities).map(ident => ident[0])).toEqual(
        [chain1.chainId, chain2.chainId]
      );
    });
  });
});
