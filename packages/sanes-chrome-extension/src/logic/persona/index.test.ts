import { Persona } from '.';
import { createUserProfile } from '../user';

describe('Persona', () => {
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
});
