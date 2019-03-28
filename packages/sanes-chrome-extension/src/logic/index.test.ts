import { getPersona } from './index';

describe('logic', () => {
  it('should get a Persona', async () => {
    const password = 'test-password';
    const accountName = 'test-account';
    const persona: Persona = await getPersona(password, accountName);
    const accounts = persona.accounts().get(accountName);
    expect(accounts.has(accountName)).toEqual(true);
    expect(accounts.blockchainAddresses().size).toEqual(4);
  });
});
