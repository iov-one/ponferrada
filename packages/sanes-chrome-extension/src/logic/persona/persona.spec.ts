import { Persona } from './persona';
import { describeWithChains } from '../../utils/test/testExecutor';

describeWithChains('Persona', () => {
  describe('create', () => {
    it('can be created', async () => {
      const persona = await Persona.create();
      expect(persona).toBeTruthy();
      persona.destroy();
    });
  });

  describe('getAccounts', () => {
    it('can get accounts', async () => {
      const persona = await Persona.create();

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(1);

      expect(accounts[0].name).toEqual('Account 0');
      expect(new Set(accounts[0].identities).size).toEqual(4);

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
  });
});
