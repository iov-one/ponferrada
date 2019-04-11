import { Persona } from './persona';
import { describeWithChains } from '../../utils/test/testExecutor';

describeWithChains('Persona', () => {
  it('can be created', async () => {
    const persona = await Persona.create();
    expect(persona).toBeTruthy();
    persona.destroy();
  });
});
