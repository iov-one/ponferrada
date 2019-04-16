import { TokenTicker } from '@iov/bcp';
import { EnglishMnemonic } from '@iov/crypto';

import { Persona } from './persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';

withChainsDescribe('Persona', () => {
  describe('create', () => {
    it('can be created', async () => {
      const persona = await Persona.create();
      expect(persona).toBeTruthy();
      persona.destroy();
    });
  });

  describe('mnemonic', () => {
    it('returns a mnemonic', async () => {
      const persona = await Persona.create();

      expect(() => {
        // this constructor throws when the mnemonic string is not valid
        new EnglishMnemonic(persona.mnemonic);
      }).not.toThrow();

      persona.destroy();
    });

    it('returns the right mnemonic', async () => {
      const presetMnemonic =
        'until apple post diamond casual bridge bird solid inform size prize debris';
      const persona = await Persona.create(presetMnemonic);

      expect(persona.mnemonic).toEqual(presetMnemonic);

      persona.destroy();
    });
  });

  describe('getAccounts', () => {
    it('can get accounts', async () => {
      const persona = await Persona.create();

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(1);

      expect(accounts[0].name).toEqual('Account 0');
      expect(accounts[0].identities.length).toEqual(4);

      persona.destroy();
    });
  });

  describe('getBalances', () => {
    it('can get balances of first account', async () => {
      const persona = await Persona.create();

      const balances = await persona.getBalances(0);
      // no address exists on chain, so balance exists
      expect(balances.length).toEqual(0);

      persona.destroy();
    });

    it('gets proper balance for Ethereum account', async () => {
      const persona = await Persona.create(
        'oxygen fall sure lava energy veteran enroll frown question detail include maximum'
      );

      const balances = await persona.getBalances(0);
      const ethBalance = balances.find(
        b => b.tokenTicker === ('ETH' as TokenTicker)
      );
      if (!ethBalance) {
        throw new Error('Did not find an ETH balance');
      }
      const approxEther = Number.parseInt(ethBalance.quantity, 10) / 1e18;

      expect(approxEther).toBeCloseTo(100, -1);

      persona.destroy();
    });

    it('throws when calling for non-existing account', async () => {
      const persona = await Persona.create();
      await expect(persona.getBalances(42)).rejects.toThrowError(
        /account does not exist/i
      );
      persona.destroy();
    });
  });
});
